import React, { useState } from 'react';
import axios from 'axios';
import './change-password.css';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            window.alert("New passwords do not match");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/change-password',
                { oldPassword, newPassword },
                { withCredentials: true }
            );

            window.alert(response.data);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error changing password:', error);
            window.alert('Error changing password');
        }
    };

    return (
        <div className="information-section">
            <div className="change-password">
                <h2>CHANGE PASSWORD</h2>
                <form onSubmit={handleChangePassword}>
                    <div className="fields">
                        <div className="password-fields">
                            <input
                                type="password"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="chge-pwd-btn">
                        <button type="submit">Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
