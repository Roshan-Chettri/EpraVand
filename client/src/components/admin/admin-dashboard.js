import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../dashboard/change-password';
import Header from '../header';
import ApproveEvent from './ApproveEvent';
import AdminEvents from './AdminEvents';

const AdminDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('events');
    //const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get('http://localhost:5000/user', { withCredentials: true });
                setUserData(userResponse.data);

                //const eventsResponse = await axios.get('http://localhost:5000/events', { withCredentials: true });
                //setEvents(eventsResponse.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
            navigate('/admin-login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <Header/>
        <div className="main_body">
            <h1>Hello Administrator - {userData.name}</h1>
            <div className="contents">
                <div className="menu-section">
                    <div className="menus-onclick">
                        <div className="events">
                            <button onClick={() => handleSectionChange('events')}>Events</button>
                        </div>
                    </div>
                    <div className="menus-offclick">
                        <div className="assigned-coordinator">
                            <button onClick={() => handleSectionChange('approveEvent')}>Approve Event</button>
                        </div>
                        <div className="participants">
                            <button onClick={() => handleSectionChange('participants')}>Participants</button>
                        </div>
                        <div className="approve-reject">
                            <button onClick={() => handleSectionChange('volunteers')}>Volunteers</button>
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
                        <AdminEvents/>
                    )}
                    {activeSection === 'approveEvent' && (
                        <ApproveEvent/>
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
                            {/* Add content for Approve/Reject section here */}
                            <p>List of volunteers will be displayed here.</p>
                        </div>
                    )}
                    {activeSection === 'changePassword' && <ChangePassword />}
                </div>
            </div>
        </div>
        </>
    );
}

export default AdminDashboard;
