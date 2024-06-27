import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CoordinatorEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/coordinator-events', { withCredentials: true });
                setEvents(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error);
                setError('Error fetching events');
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Function to format date and time
    const formatDate = (dateTimeString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
        return new Date(dateTimeString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (events.length === 0) {
        return <div className='not-found'>No Event Found</div>;
    }

    return (
        <div>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Event Title</th>
                        <th>Categories</th>
                        <th>Status</th>
                        <th>Start Date & Time</th>
                        <th>End Date & Time</th>
                        <th>Venue</th>
                        <th>Files</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event.event_id}>
                            <td>{event.title}</td>
                            <td>{event.category}</td>
                            <td>{event.is_approved ? 'Approved' : 'Pending'}</td>
                            <td>{formatDate(event.start_date)}</td>
                            <td>{formatDate(event.end_date)}</td>
                            <td>{event.venue}</td>
                            <td>
                                {event.file_path.map((file, index) => (
                                    <a key={index} href={`http://localhost:5000/${file}`} target="_blank" rel="noopener noreferrer">
                                        File {index + 1}
                                    </a>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CoordinatorEvents;
