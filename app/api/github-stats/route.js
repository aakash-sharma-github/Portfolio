import axios from 'axios';
import { getFromCache, setInCache } from '../../../lib/cache';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';


export async function GET() {
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
    const fallbackData = {
      repoCount: 25, // Fallback repository count
      totalCommits: 500 // Fallback commit count
    };
    
    // Cache the fallback data for 1 hour
    setInCache(cacheKey, fallbackData, 60);
    
    return new Response(
      JSON.stringify(fallbackData),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const fetchReposQuery = `
    query ($login: String!, $after: String) {
      user(login: $login) {
        repositories(first: 100, after: $after, isFork: false) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            name
          }
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
              history {
                totalCount
              }
            }
          }
        }
      }
    }
  `;

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
      if (defaultBranchRef && defaultBranchRef.target.history) {
        return defaultBranchRef.target.history.totalCount;
      }
    } catch (error) {
      console.error(`Error fetching commits for repository ${repoName}:`, error.message);
    }
    return 0;
  };

  try {
    const repos = await fetchRepositories();
    const repoCount = repos.length;

    // Fetch commits in parallel
    const commitPromises = repos.map(repo => fetchCommits(repo.name));
    const commitCounts = await Promise.all(commitPromises);
    const totalCommits = commitCounts.reduce((acc, count) => acc + count, 0);

    const result = { repoCount, totalCommits };
    // Cache for 6 hours since GitHub stats don't change frequently
    setInCache(cacheKey, result, 360);

    return new Response(
      JSON.stringify(result),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching GitHub stats:', error.message);
    
    // Return fallback data instead of error to prevent UI breaks
    const fallbackData = {
      repoCount: 25,
      totalCommits: 500
    };
    
    // Cache the fallback data for 30 minutes (shorter cache for errors)
    setInCache(cacheKey, fallbackData, 30);
    
    return new Response(
      JSON.stringify(fallbackData),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
