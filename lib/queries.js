// lib/queries.js
// GitHub GraphQL API v4 queries

/**
 * Fetches all owned (non-fork) repos.
 * Paginated via $cursor — handles any number of repos.
 *
 * Filters:
 *   ownerAffiliations: OWNER  → only your own repos
 *   isFork: false             → no forked repos
 *
 * NOTE: defaultBranchRef.history is intentionally excluded — it requires
 * elevated scopes and is blocked by fine-grained PATs. Commit counts are
 * fetched separately via the REST contributors API (no extra scope needed).
 */
export const GITHUB_REPOS_QUERY = /* graphql */ `
  query GitHubRepos($login: String!, $cursor: String, $perPage: Int!) {
    user(login: $login) {
      ownedRepos: repositories(
        first: $perPage
        after: $cursor
        ownerAffiliations: OWNER
        isFork: false
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          name
          isFork
        }
      }
    }
  }
`;