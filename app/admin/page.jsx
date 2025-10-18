"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import ClientOnly from '@/components/ClientOnly';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if already authenticated
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (token) {
                    const isValid = await authApi.verifyToken(token);
                    if (isValid) {
                        router.push('/admin/dashboard');
                    } else {
                        localStorage.removeItem('adminToken');
                    }
                }
            } catch (error) {
                localStorage.removeItem('adminToken');
            }
        };

        checkAuth();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Attempting login...');
            const result = await authApi.login(password);

            if (result.token) {
                localStorage.setItem('adminToken', result.token);
                console.log('Login successful, redirecting...');
                router.push('/admin/dashboard');
            } else {
                setError('No token received from server.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <ClientOnly>
            <div className="min-h-screen bg-primary flex items-center justify-center p-4">
                <div className="bg-[#1e1e24] rounded-lg overflow-hidden shadow-lg p-8 max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
                        <p className="text-white/70">Enter your password to access the admin dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-md">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="block text-white/80 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="text-white/50" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-2 bg-[#2a2a35] border border-[#3a3a45] rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-white"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/80 transition-colors"
                                    onClick={toggleShowPassword}
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 bg-accent hover:bg-accent-hover text-primary rounded-md flex items-center justify-center gap-2 transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <FiLogIn />
                                    <span>Login</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </ClientOnly>
    );
};

export default AdminLogin;