// Dashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/user', { withCredentials: true });
                setUserData(response.data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                setError('Failed to fetch user data');
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/logout', null, { withCredentials: true });
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            setError('Logout failed');
        }
    };

    return (
        <div>
            <h2>Dashboard</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {userData && (
                <div>
                    <p>Welcome, {userData.username}!</p>
                    <p>Email: {userData.email}</p>
                    {/* Add more user data fields as needed */}
                </div>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
