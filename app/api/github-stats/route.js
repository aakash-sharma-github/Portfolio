import axios from 'axios';

export async function GET() {
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
    const token = process.env.GITHUB_TOKEN;


    if (!username || !token) {
        return new Response(JSON.stringify({ error: 'GitHub credentials are not configured' }), { status: 500 });
    }

    try {
        // Fetch all repositories
        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, {
            headers: {
                Authorization: `token ${token}`
            }
        });

        const repos = reposResponse.data;
        const repoCount = repos.length;

        // Fetch commit counts for each repository
        let totalCommits = 0;
        for (const repo of repos) {
            const commitsResponse = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`, {
                headers: {
                    Authorization: `token ${token}`
                }
            });

            const commitsLinkHeader = commitsResponse.headers.link;
            let commitsCount = 0;
            if (commitsLinkHeader) {
                const lastPageLink = commitsLinkHeader.split(',').find(s => s.includes('rel="last"'));
                if (lastPageLink) {
                    commitsCount = parseInt(lastPageLink.match(/&page=(\d+)>/)[1], 10);
                }
            }
            totalCommits += commitsCount;
        }

        return new Response(JSON.stringify({ repoCount, totalCommits }), { status: 200 });

    } catch (error) {
        console.error('Error fetching GitHub stats:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: error.response?.status || 500 });
    }
}
