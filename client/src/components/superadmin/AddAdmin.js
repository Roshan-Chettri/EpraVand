import React, { useState } from "react";
import axios from "axios";
import {toast } from 'react-toastify';
import './AddAdmin.css';

const AddAdmin = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name,
            email,
            phone,
            username,
            password
        };

        try {
            const response = await axios.post('http://localhost:5000/add-admin-profile', formData);
            console.log('Admin profile added:', response.data);
            toast.success('Event Created Successfully!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
           
                // Clear form fields on success
                setName('');
                setEmail('');
                setPhone('');
                setUsername('');
                setPassword('');
        } catch (error) {
            console.error('Error adding admin profile:', error);
            toast.error('Error Creating Event!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="admin-profile-form" id="add-admin">
                <h2>FILL THE DETAILS</h2>
                <input
                    type="text"
                    className="admin-name"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    className="admin-email"
                    placeholder="Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="tel"
                    className="admin-number"
                    placeholder="Contact Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <input
                    type="text"
                    className="admin-uname"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="admin-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="add-admin">ADD ADMIN</button>
            </form>
        </>
    );
}

export default AddAdmin;
