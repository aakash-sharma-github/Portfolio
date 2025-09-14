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
                const response = await axios.get('/api/github-stats', {
                    timeout: 10000 // 10 second timeout
                });
                setData(response.data);
                setError(null);
            } catch (error) {
                console.warn('GitHub stats not available, using fallback values:', error.message);
                setError(error.message);
                // Keep the fallback values already set in initial state
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
