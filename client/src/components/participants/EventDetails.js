import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import Header from '../header';
import Footer from '../footer';
import './EventDetails.css';

const EventDetails = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/events/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setEventDetails(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to fetch event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const findFirstImagePath = (filePaths) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"]; // Add more extensions if needed
    for (let path of filePaths) {
      for (let ext of imageExtensions) {
        if (path.toLowerCase().endsWith(ext)) {
          return path;
        }
      }
    }
    return null; // Return null if no valid image path found
  };

  const defaultImage = "http://localhost:5000/uploads/default-image.png";

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!eventDetails) {
    return <p>No event details found</p>;
  }

  return (
    <>
      <Header />
      <div className='first-info'>
        <div className="title-des-section">
          <div className="title">
            <h1>{eventDetails.title.toUpperCase()}</h1>
            <p>{eventDetails.description}</p>
          </div>
          <div className="image-section">
            <img src={eventDetails.file_path.length !== 0 ? `http://localhost:5000/${findFirstImagePath(eventDetails.file_path)}` : defaultImage} alt="event" />
          </div>
        </div>
      </div>

      {/* Coordinator details */}
      <div className="coordinator-details">
        <h2>EVENT COORDINATORS</h2>
        <div className="cord">
          <div className="cor-info">
            <img src="/logos/User Icon.png" alt="user-icon" />
            <h3>{eventDetails.coordinator_name}</h3>
          </div>
          <div className="cor-info">
            <img src="/logos/Email Icon - View Details.png" alt="email-icon" />
            <h3>{eventDetails.email}</h3>
          </div>
          <div className="cor-info">
            <img src="/logos/Event Icon.png" alt="event-icon" />
            <h3>{eventDetails.title}</h3>
          </div>
        </div>
      </div>

      {/* Sub-event coordinators */}
      {eventDetails.sub_events_coordinators && eventDetails.sub_events_coordinators.length > 0 && (
        <div className="coordinator-details">
          <h2>SUB-EVENT COORDINATORS</h2>
          {eventDetails.sub_events_coordinators.map((subCoordinator, index) => (
            <div key={index} className="cord">
              <div className="cor-info">
                <img src="/logos/User Icon.png" alt="user-icon" />
                <h3>{subCoordinator.name}</h3>
              </div>
              <div className="cor-info">
                <img src="/logos/Email Icon - View Details.png" alt="email-icon" />
                <h3>{subCoordinator.email}</h3>
              </div>
              <div className="cor-info">
                <img src="/logos/Event Icon.png" alt="event-icon" />
                <h3>{subCoordinator.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extra Information */}
      <div className="second-info">
        <div className="extra-info">
          <div className="icon">
            <img src="/logos/Details Cal Icon.png" alt='Calender' />
          </div>
          <div className="details">
            <h2>Date & Time</h2>
            <p>{new Date(eventDetails.start_date).toLocaleDateString()}</p>
          </div>
        </div>
        {/* Venue Section */}
        <div className="extra-info">
          <div className="icon">
            <img src="/logos/Details Location Icon.png" alt='location' />
          </div>
          <div className="details">
            <h2>Venue</h2>
            <p>{eventDetails.venue}</p>
          </div>
        </div>
        {/* Files Section */}
        {eventDetails.file_path && eventDetails.file_path.length > 0 && (
          <div className="extra-info">
            <div className="icon">
              <img src="/logos/Details File Icon.png" alt='files' />
            </div>
            <div className="details">
              <h2>Files</h2>
              {eventDetails.file_path.map((filePath, index) => (
                <button key={index} onClick={() => window.open(`http://localhost:5000/${filePath}`, '_blank')}>
                  {filePath}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Register Buttons */}
      <div className="third-info">
        <button className="volunteers">Register as Volunteers</button>
        <Link to={`/events/${eventId}/registration`} ><button className="participants">Register as Participants</button></Link>
      </div>

      <Footer />
    </>
  );
};

export default EventDetails;
