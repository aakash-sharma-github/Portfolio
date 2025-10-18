// Explicitly set Node.js runtime (never runs on client)
export const runtime = 'nodejs';

export async function GET() {
  // ✅ Dynamically import axios + cache utilities only on server
  const { default: axios } = await import('axios');
  const { getFromCache, setInCache } = await import('@/lib/cache');

  const cacheKey = 'github-stats';
  const cachedData = getFromCache(cacheKey);

  if (cachedData) {
    return new Response(JSON.stringify(cachedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;

  // Return fallback values if GitHub credentials are not configured
  if (!token || !username) {
    console.warn('GitHub credentials not configured, using fallback values');
    const fallbackData = { repoCount: 25, totalCommits: 500 };
    setInCache(cacheKey, fallbackData, 60); // cache 1h
    return new Response(JSON.stringify(fallbackData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // GraphQL queries
  const fetchReposQuery = `
    query ($login: String!, $after: String) {
      user(login: $login) {
        repositories(first: 100, after: $after, isFork: false) {
          totalCount
          pageInfo { hasNextPage endCursor }
          nodes { name }
        }
      }
    }
  `;

  const fetchCommitsQuery = `
    query ($login: String!, $repoName: String!) {
      repository(owner: $login, name: $repoName) {
        defaultBranchRef {
          target {
            ... on Commit {
              history { totalCount }
            }
          }
        }
      }
    }
  `;

  // Fetch repositories (paginated)
  const fetchRepositories = async () => {
    let repos = [];
    let hasNextPage = true;
    let after = null;

    while (hasNextPage) {
      const response = await axios.post(
        'https://api.github.com/graphql',
        {
          query: fetchReposQuery,
          variables: { login: username, after }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data.data.user.repositories;
      repos = repos.concat(data.nodes);
      hasNextPage = data.pageInfo.hasNextPage;
      after = data.pageInfo.endCursor;
    }

    return repos;
  };

  // Fetch commit count for a repo
  const fetchCommits = async (repoName) => {
    try {
      const response = await axios.post(
        'https://api.github.com/graphql',
        {
          query: fetchCommitsQuery,
          variables: { login: username, repoName }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const defaultBranchRef = response.data.data.repository.defaultBranchRef;
      return defaultBranchRef?.target?.history?.totalCount || 0;
    } catch (error) {
      console.error(`Error fetching commits for repo ${repoName}:`, error.message);
      return 0;
    }
  };

  try {
    const repos = await fetchRepositories();
    const repoCount = repos.length;

    // Fetch commits in parallel
    const commitCounts = await Promise.all(repos.map(r => fetchCommits(r.name)));
    const totalCommits = commitCounts.reduce((a, b) => a + b, 0);

    const result = { repoCount, totalCommits };

    // Cache for 6 hours (GitHub stats don’t change too often)
    setInCache(cacheKey, result, 360);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error.message);

    // Fallback response
    const fallbackData = { repoCount: 25, totalCommits: 500 };
    setInCache(cacheKey, fallbackData, 30); // cache 30m on error
    return new Response(JSON.stringify(fallbackData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
