import React, { useState } from 'react';
import Login from '../login/login';
import Register from './register';
import './auth-toggle.css';

const AuthToggle = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuth = () => {
        setIsLogin(!isLogin);
    };

    return (
        <>
            {isLogin ? <Login role_id={3} user = {"COORDINATOR"} /> : <Register />}
            <button onClick={toggleAuth} className="toggle-button">
                {isLogin ? 'Go to Register' : 'Go to Login'}
            </button>
        </>
    );
};

export default AuthToggle;
