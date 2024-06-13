import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApproveEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events-for-approval', { withCredentials: true });
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events for approval:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (eventId) => {
    try {
      await axios.put(`http://localhost:5000/approve-event/${eventId}`, {}, { withCredentials: true });
      // Refresh events after approval
      const response = await axios.get('http://localhost:5000/events-for-approval', { withCredentials: true });
      setEvents(response.data);
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleReject = async (eventId) => {
    try {
      await axios.put(`http://localhost:5000/reject-event/${eventId}`, {}, { withCredentials: true });
      // Refresh events after rejection
      const response = await axios.get('http://localhost:5000/events-for-approval', { withCredentials: true });
      setEvents(response.data);
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };

   // Function to format date and time
   const formatDate = (dateTimeString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
};

  return (
    <div>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p className='not-found'>No new Events for approval</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th className="title">Title</th>
              <th className="start-date">Start Date</th>
              <th className="end-date">End Date</th>
              <th className="event-venue">Venue</th>
              <th className="coordinator">Coordinator</th>
              <th className="sub-events">Sub-events</th>
              <th className="files">Files</th> {/* Changed from Status to Files */}
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.event_id}>
                <td>{event.title}</td>
                <td>{formatDate(event.start_date)}</td>
                <td>{formatDate(event.end_date)}</td>
                <td>{event.venue}</td>
                <td>{event.coordinator_name}</td>
                <td>
                  {event.sub_events_titles && event.sub_events_titles.length > 0 ? (
                    <ul>
                      {event.sub_events_titles.map((title, index) => (
                        <li key={index}>{title} - {event.sub_events_coordinators[index]}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
                <td>
                  {event.file_path && event.file_path.length > 0 ? (
                    <ul>
                      {event.file_path.map((file, index) => (
                        <li key={index}>

                          <a href={`http://localhost:5000/${file}`} target="_blank" rel="noopener noreferrer">
                            File {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleApprove(event.event_id)}>Approve</button>
                  <button onClick={() => handleReject(event.event_id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApproveEvent;
