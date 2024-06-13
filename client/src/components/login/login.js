import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../header';
import './login.css';

const Login = ({ role_id, user }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:5000/login', 
                { username, password, role_id }, 
                { withCredentials: true }
            );

            console.log(role_id);
            // Redirect to the appropriate dashboard based on role ID
            if (role_id === 1) {
                navigate('/superadmin-dashboard');
            } else if (role_id === 2) {
                navigate('/admin-dashboard');
            } else if (role_id === 3) {
                navigate('/coordinator-dashboard');
            } else {
                throw new Error('Invalid role ID');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Invalid username or password');
        }
    };

    return (
        <>          
            <Header/>
            <div className="login_main_body">
                <div className="img-logo">
                    <img src="/logos/EPraVand Logo.png" alt="EPraVand Logo"/>
                    <h1>manage your events</h1>
                </div>
                <div className="content">
                    <h1>{user} LOG IN</h1>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        {/* Username and Password input fields */}
                        <div className="text-fields">
                            <img src="/logos/Email icon - registration.png" alt="Email Icon"/>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="text-fields">
                            <img src="/logos/Password Icon.png" alt="Password Icon"/>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className='login'>
                            <button type="submit" className="login-button"><h2>Login</h2></button>
                            <a href="#aaa">Forget Password?</a>
                        </div>
                    </form>
                    {user === 'COORDINATOR' && (
                        <div className="or-section">
                            <hr/><p>or</p><hr/>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Login;
