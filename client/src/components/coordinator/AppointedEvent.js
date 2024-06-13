import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddSubEventDetailsForm from './AddSubEventDetailsForm';

const AppointedEvent = () => {
    const [subEvents, setSubEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSubEvent, setSelectedSubEvent] = useState(null);

    useEffect(() => {
        const fetchSubEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/appointed-sub-events', { withCredentials: true });
                setSubEvents(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching sub-events:', error);
                setError('Error fetching sub-events');
                setLoading(false);
            }
        };

        fetchSubEvents();
    }, []);

    const handleAddDetails = (subEvent) => {
        setSelectedSubEvent(subEvent);
    };

    const handleCloseForm = () => {
        setSelectedSubEvent(null);
    };
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

    if (subEvents.length === 0) {
        return <div>No sub-events found</div>;
    }
    

    return (
        <div>
            {selectedSubEvent ? (
                <AddSubEventDetailsForm subEvent={selectedSubEvent} onClose={handleCloseForm} />
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Sub-Event Title</th>
                            <th>Main Event Title</th>
                            <th>Event Coordinator</th>
                            <th>Start Date & Time</th>
                            <th>End Date & Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subEvents.map(subEvent => (
                            <tr key={subEvent.sub_event_id}>
                                <td>{subEvent.title}</td>
                                <td>{subEvent.main_event_title}</td>
                                <td>{subEvent.coordinator_name}</td>
                                <td>{formatDate(subEvent.start_date)}</td>
                                <td>{formatDate(subEvent.end_date)}</td>
                                <td>
                                    <button onClick={() => handleAddDetails(subEvent)}>Add Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AppointedEvent;
