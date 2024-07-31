import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const GitHubContext = createContext();

export const GitHubProvider = ({ children }) => {
    const [data, setData] = useState({ repoCount: 0, totalCommits: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/github-stats');
                setData(response.data);
                console.log(`responsecontext: `, response.data);
            } catch (error) {
                console.error('Error fetching GitHub stats:', error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <GitHubContext.Provider value={{ data }}>
            {children}
        </GitHubContext.Provider>
    );
};

export const useGitHub = () => useContext(GitHubContext);
