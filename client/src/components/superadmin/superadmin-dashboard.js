import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../dashboard/change-password';
import Header from '../header';

const SuperAdminDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('events');
    const [coordinators, setCoordinators] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get('http://localhost:5000/user', { withCredentials: true });
                setUserData(userResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (activeSection === 'approveReject') {
            const fetchCoordinators = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/coordinators', { withCredentials: true });
                    setCoordinators(response.data);
                } catch (error) {
                    console.error('Error fetching coordinators:', error);
                }
            };

            fetchCoordinators();
        }
    }, [activeSection]);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
            navigate('/superadmin-login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:5000/coordinators/${id}/approve`, {}, { withCredentials: true });
            setCoordinators(prev => prev.map(coord => coord.user_id === id ? { ...coord, is_approved: true } : coord));
        } catch (error) {
            console.error('Error approving coordinator:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`http://localhost:5000/coordinators/${id}/reject`, {}, { withCredentials: true });
            setCoordinators(prev => prev.filter(coord => coord.user_id !== id));
        } catch (error) {
            console.error('Error rejecting coordinator:', error);
        }
    };

    const handleDisable = async (id) => {
        try {
            await axios.post(`http://localhost:5000/coordinators/${id}/disable`, {}, { withCredentials: true });
            setCoordinators(prev => prev.map(coord => coord.user_id === id ? { ...coord, is_disabled: true } : coord));
        } catch (error) {
            console.error('Error disabling coordinator:', error);
        }
    };

    const handleEnable = async (id) => {
        try {
            await axios.post(`http://localhost:5000/coordinators/${id}/enable`, {}, { withCredentials: true });
            setCoordinators(prev => prev.map(coord => coord.user_id === id ? { ...coord, is_disabled: false } : coord));
        } catch (error) {
            console.error('Error enabling coordinator:', error);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <div className="main_body">
                <h1>Hello Super Administrator - {userData.name}</h1>
                <div className="contents">
                    <div className="menu-section">
                        <div className="menus-onclick">
                            <div className="events">
                                <button onClick={() => handleSectionChange('events')}>Events</button>
                            </div>
                        </div>
                        <div className="menus-offclick">
                            <div className="assigned-coordinator">
                                <button onClick={() => handleSectionChange('assignedCoordinator')}>Assigned Coordinator</button>
                            </div>
                            <div className="participants">
                                <button onClick={() => handleSectionChange('participants')}>Participants</button>
                            </div>
                            <div className="approve-reject">
                                <button onClick={() => handleSectionChange('approveReject')}>Approve/Reject</button>
                            </div>
                            <div className="change-password">
                                <button onClick={() => handleSectionChange('changePassword')}>Change Password</button>
                            </div>
                        </div>
                        <div className="logout">
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                    <div className="information-section">
                        {activeSection === 'events' && (
                            <table>
                                <thead>
                                    <tr>
                                        <th className="event-title">Event Title</th>
                                        <th className="categories">Categories</th>
                                        <th className="status">Status</th>
                                        <th className="start-date-time">Start Date & Time</th>
                                        <th className="end-date-time">End Date & Time</th>
                                        <th className="venue">Venue</th>
                                        <th className="files">Files</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        )}
                        {activeSection === 'assignedCoordinator' && (
                            <div>
                                <h2>Assigned Coordinator</h2>
                                {/* Add content for Assigned Coordinator section here */}
                                <p>List of assigned coordinators will be displayed here.</p>
                            </div>
                        )}
                        {activeSection === 'participants' && (
                            <div>
                                <h2>Participants</h2>
                                {/* Add content for Participants section here */}
                                <p>List of participants will be displayed here.</p>
                            </div>
                        )}
                        {activeSection === 'approveReject' && (
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Username</th>
                                            <th>Approval Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {coordinators.map(coordinator => (
                                            <tr key={coordinator.user_id}>
                                                <td>{coordinator.name}</td>
                                                <td>{coordinator.email}</td>
                                                <td>{coordinator.phone}</td>
                                                <td>{coordinator.username}</td>
                                                <td>{coordinator.is_approved ? 'Approved' : 'Pending'}</td>
                                                <td>
                                                    {!coordinator.is_approved && (
                                                        <>
                                                            <button onClick={() => handleApprove(coordinator.user_id)}>Approve</button>
                                                            <button onClick={() => handleReject(coordinator.user_id)}>Reject</button>
                                                        </>
                                                    )}
                                                    {coordinator.is_approved && (
                                                        <>
                                                            <button onClick={() => coordinator.is_disabled ? handleEnable(coordinator.user_id) : handleDisable(coordinator.user_id)}>
                                                                {coordinator.is_disabled ? 'Enable' : 'Disable'}
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeSection === 'changePassword' && <ChangePassword />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SuperAdminDashboard;
