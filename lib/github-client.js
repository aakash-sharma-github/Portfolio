// lib/github-client.js
// Server-side only. Never import this in client components.
//
// Why REST for commit counts instead of GraphQL?
// The defaultBranchRef.history.totalCount field is blocked by fine-grained
// Personal Access Tokens (PATs). The REST /commits endpoint with per_page=1
// reads the Link header to get the total count — no extra scopes needed.

import { GITHUB_REPOS_QUERY } from './queries.js';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';
const GITHUB_REST_URL = 'https://api.github.com';
const PER_PAGE = 100;

// ─── Shared headers ───────────────────────────────────────────────────────────

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'portfolio-github-stats/1.0',
    Accept: 'application/vnd.github+json',
  };
}

// ─── GraphQL Executor ─────────────────────────────────────────────────────────

async function executeGraphQL(query, variables, token) {
  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub GraphQL HTTP ${res.status}: ${text}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    const msgs = json.errors.map((e) => e.message).join('; ');
    throw new Error(`GitHub GraphQL errors: ${msgs}`);
  }

  if (!json.data) throw new Error('GitHub GraphQL returned no data');

  return json.data;
}

// ─── Paginated Repo Fetcher (GraphQL) ────────────────────────────────────────

async function fetchAllRepos(login, token) {
  const allRepos = [];
  let cursor = null;

  do {
    const page = await executeGraphQL(
      GITHUB_REPOS_QUERY,
      { login, cursor, perPage: PER_PAGE },
      token
    );

    const { ownedRepos } = page.user;
    allRepos.push(...ownedRepos.nodes);

    cursor = ownedRepos.pageInfo.hasNextPage
      ? ownedRepos.pageInfo.endCursor
      : null;
  } while (cursor !== null);

  return allRepos;
}

// ─── Commit Count via REST ────────────────────────────────────────────────────
//
// Strategy: fetch the default branch commits with per_page=1.
// If there are multiple pages, GitHub includes a Link header with rel="last"
// whose page number equals the total commit count.
// If there is no Link header, the entire history fits on one page — count the
// items in the response body directly.
//
// NO author filter: we want ALL commits on the default branch of your own repo,
// regardless of which git email was used per commit.

async function fetchCommitCount(login, repoName, token) {
  // 5-second timeout per repo — prevents one slow repo hanging everything
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const url = `${GITHUB_REST_URL}/repos/${login}/${repoName}/commits?per_page=1`;
    const res = await fetch(url, {
      headers: authHeaders(token),
      signal: controller.signal,
      cache: 'no-store',
    });

    // 409 = empty repo (no commits yet); 404 = repo gone; anything else = skip
    if (!res.ok) return 0;

    const link = res.headers.get('link') ?? '';

    // Multi-page: Link header contains rel="last" with the final page number
    const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
    if (match) return parseInt(match[1], 10);

    // Single page: no Link header — parse body to see if there is 1 commit or 0
    const body = await res.json();
    return Array.isArray(body) ? body.length : 0;
  } catch {
    return 0; // timeout or network error — skip this repo, don't fail the whole request
  } finally {
    clearTimeout(timer);
  }
}

// ─── Commit offset ───────────────────────────────────────────────────────────
//
// The REST /commits endpoint only sees commits on the default branch.
// Commits on other branches, squash-merged PRs whose branches were deleted,
// and any repos where history was rewritten are invisible to this API.
// This offset accounts for that gap.
//
// HOW TO KEEP IT ACCURATE:
//   1. Check your real total on https://github.com/YOUR_USERNAME
//      (or count via: git log --all --oneline | wc -l across all local repos)
//   2. Subtract what the API is returning (log it temporarily if needed)
//   3. Update the number below and redeploy
//
// Last calibrated: 2026-05-18  |  API returned ~N, real total ~N+210
const COMMIT_OFFSET = 210;

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Fetches repo count + total commit count for all owned (non-fork) repos.
 *
 * @param {string} login  - GitHub username
 * @param {string} token  - GitHub PAT (classic or fine-grained, public_repo scope)
 * @returns {Promise<{ repoCount: number, totalCommits: number, fetchedAt: string }>}
 */
export async function fetchGitHubStats(login, token) {
  if (!token) throw new Error('GITHUB_TOKEN is not configured');
  if (!login) throw new Error('GITHUB_USERNAME is not configured');

  // 1. Get all owned non-fork repo names via GraphQL
  const rawRepos = await fetchAllRepos(login, token);
  const ownedRepos = rawRepos.filter((r) => !r.isFork); // belt-and-suspenders

  const repoCount = ownedRepos.length;

  // 2. Fetch ALL commit counts fully in parallel — no batching needed since
  //    each request is a cheap HEAD-like call (per_page=1, reads Link header only).
  //    Promise.all fires all requests simultaneously; total time = slowest single repo.
  const counts = await Promise.all(
    ownedRepos.map((r) => fetchCommitCount(login, r.name, token))
  );
  const apiCommits = counts.reduce((a, b) => a + b, 0);

  // Add offset to cover commits the REST API cannot see (other branches,
  // deleted PR branches, rewritten history, etc.)
  const totalCommits = apiCommits + COMMIT_OFFSET;

  return {
    repoCount,
    totalCommits,
    fetchedAt: new Date().toISOString(),
  };
}