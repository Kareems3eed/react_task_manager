import { useState, useEffect } from "react";
import { login } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/tasks");
        }
    }, []);

    const handleLogin = async () => {
        try {
            setError("");

            const res = await login({ username, password });

            // save token
            localStorage.setItem("token", res.access);

            // redirect to tasks page
            navigate("/tasks");
        } catch (err: any) {
            console.log(err.response.data);
            setError("Invalid credentials");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
                    <p className="mt-2 text-sm text-slate-600">Please enter your credentials to access your tasks</p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Username</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <input
                                type="password"
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;