import axios from 'axios';

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;

  if (!token || !username) {
    return new Response(
      JSON.stringify({ error: 'GitHub credentials are not configured' }),
      { status: 500 }
    );
  }

  const query = `
    query {
      user(login: "${username}") {
        repositories(first: 100) {
          totalCount
          nodes {
            name
            object(expression: "main") {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const repos = response.data.data.user.repositories.nodes;
    const repoCount = response.data.data.user.repositories.totalCount;
    let totalCommits = 0;

    repos.forEach(repo => {
      if (repo.object && repo.object.history) {
        totalCommits += repo.object.history.totalCount;
      }
    });

    return new Response(
      JSON.stringify({ repoCount, totalCommits }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching GitHub stats:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: error.response?.status || 500 }
    );
  }
}
