import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.preventDefault();

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Handle successful login (e.g., redirect)
                console.log('Logged in successfully');
                navigate('/homepage')
            } else {
                // Handle login error (e.g., display error message)
                console.error('Login failed');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
}

export default LoginForm;
