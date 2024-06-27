import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {toast } from 'react-toastify';
import './register.css';  
import Header from '../header';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register', { name, email, phone, username: email, password });
            toast.success('Registered successfully', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
            navigate('/coordinator-login');
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data === 'Email already exists') {
                toast.warn('Email already exists', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
            } else {
                toast.error('Registration failed', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
            }
        }
    };

    return (
        <>
        <Header/>
        <div className="registration_main_body">
            <div className="img-logo">
                <img src="/logos/EPraVand Logo.png" alt="EPraVand Logo" />
                <h1>manage your events</h1>
            </div>
            <div className="content">
                <h1>Register</h1>
                <form onSubmit={handleSubmit} className='register-form'>
                    <div className="text-fields">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="text-fields">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="text-fields">
                        <input
                            type="text"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                   
                    <div className="text-fields">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className='login-button'><h2>Register</h2></button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default Register;
