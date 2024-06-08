import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../header';
import ChangePassword from '../dashboard/change-password';
import './dashboard.css';
import AddEvent from './AddEvent';

const Dashboard = () => {
    const [userData, setUserData] = useState(null); // State to set the user
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('events'); // State to track active section
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/user', { withCredentials: true }); // to fetch the username
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Error fetching user data');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/logout', {}, { withCredentials: true }); // handles logout
            navigate('/coordinator-login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Handlers for menu buttons
    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <>
            <Header />
            <div className="main_body">
                <h1>Hello Coordinator - {userData.name}</h1>
                <div className="contents">
                    <div className="menu-section">
                        <div className="menus-onclick">
                            <div className="events">
                                <button onClick={() => handleSectionChange('events')}>Events</button>
                            </div>
                        </div>
                        <div className="menus-offclick">
                            <div className="approval-request">
                                <button onClick={() => handleSectionChange('addNewEvent')}>Add New Event</button>
                            </div>
                            <div className="participants">
                                <button onClick={() => handleSectionChange('participants')}>Participants</button>
                            </div>
                            <div>
                                <button onClick={() => handleSectionChange('volunteers')}>Volunteers</button>
                            </div>
                            <div>
                                <button onClick={() => handleSectionChange('newRequest')}>New Request</button>
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
                            <div>
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
                            </div>
                        )}
                        {activeSection === 'addNewEvent' && (
                            <AddEvent/>
                        )}
                        {activeSection === 'newRequest' && (
                            <div>
                                <h2>New Participants Request</h2>
                                {/* Add content for Approval Request section here */}
                                <p>List of requests of participants for approval will be displayed here.</p>
                            </div>
                        )}
                        {activeSection === 'participants' && (
                            <div>
                                <h2>Participants</h2>
                                {/* Add content for Participants section here */}
                                <p>List of participants will be displayed here.</p>
                            </div>
                        )}
                        {activeSection === 'volunteers' && (
                            <div>
                                <h2>Volunteers</h2>
                                {/* Add content for Participants section here */}
                                <p>List of Volunteers will be displayed here.</p>
                            </div>
                        )}
                        {activeSection === 'changePassword' && (
                            <ChangePassword/>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
