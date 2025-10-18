import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const GitHubContext = createContext();

export const GitHubProvider = ({ children }) => {
    const [data, setData] = useState({ repoCount: 25, totalCommits: 500 }); // Set fallback as initial values
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Try to fetch data with error handling
                try {
                    const response = await axios.get('/api/github-stats', {
                        timeout: 5000 // 5 second timeout
                    });
                    setData(response.data);
                    setError(null);
                } catch (fetchError) {
                    console.warn('GitHub stats not available, using fallback values:', fetchError.message);
                    // Keep using the fallback values already set in initial state
                    setError(fetchError.message);
                }
            } finally {
                setIsLoading(false);
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
