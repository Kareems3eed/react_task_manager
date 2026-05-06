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
        <div>
            <h2>Login</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>Login</button>

            {error && <p>{error}</p>}
        </div>
    );
}

export default LoginPage;