import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../dashboard/change-password';
import Header from '../header';
import ApproveReject from './ApproveReject';
import SuperAdminEvent from './SuperAdminEvent';


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
                                <button 
                                    className={activeSection === 'events' ? 'active-button' : ''}
                                    onClick={() => handleSectionChange('events')}
                                >
                                    Events
                                </button>
                            </div>
                        </div>
                        <div className="menus-onclick">
                            <div className="assigned-coordinator">
                                <button 
                                    className={activeSection === 'assignedCoordinator' ? 'active-button' : ''}
                                    onClick={() => handleSectionChange('assignedCoordinator')}
                                >
                                    Assigned Coordinator
                                </button>
                            </div>
                            <div className="participants">
                                <button 
                                    className={activeSection === 'participants' ? 'active-button' : ''}
                                    onClick={() => handleSectionChange('participants')}
                                >
                                    Participants
                                </button>
                            </div>
                            <div className="approve-reject">
                                <button 
                                    className={activeSection === 'approveReject' ? 'active-button' : ''}
                                    onClick={() => handleSectionChange('approveReject')}
                                >
                                    Approve/Reject
                                </button>
                            </div>
                            <div className="change-password">
                                <button 
                                    className={activeSection === 'changePassword' ? 'active-button' : ''}
                                    onClick={() => handleSectionChange('changePassword')}
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                        <div className="logout">
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                    <div className="information-section">
                        {activeSection === 'events' && (
                            <SuperAdminEvent/>
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
                            <ApproveReject 
                                coordinators={coordinators}
                                handleApprove={handleApprove}
                                handleReject={handleReject}
                                handleDisable={handleDisable}
                                handleEnable={handleEnable}
                            />
                        )}
                        {activeSection === 'changePassword' && <ChangePassword />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SuperAdminDashboard;
