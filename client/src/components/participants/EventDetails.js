import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!eventDetails) {
    return <p>No event details found</p>;
  }

 

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

  return (
    <>
    <Header/>
    <div className='first-info'>
        <div className="title-des-section">
        <div className="title">
            <h1>{eventDetails.title}</h1>
            <p>{eventDetails.description}</p>
        </div>
        <div class="image-section">
        <img src={eventDetails.file_path.length !==0 ? `http://localhost:5000/${findFirstImagePath(eventDetails.file_path)}` : defaultImage} alt="event" />
        </div>
        </div>
    </div>
    {/* <!-- Extra Information --> */}
    <div class="second-info">
        <div class="extra-info">
            <div class="icon">
                <img src="/logos/Details Cal Icon.png" alt='Calender'/>
            </div>
            <div class="details">
                <h2>Date & Time</h2>
                <p>{new Date(eventDetails.start_date).toLocaleDateString()}</p>
            </div>
        </div>
        {/* <!-- Venue Section --> */}
        <div class="extra-info">
            <div class="icon">
                <img src="/logos/Location.png" alt='location'/>
            </div>
            <div class="details">
                <h2>Venue</h2>
                <p>{eventDetails.venue}, 5th Mile, Tadong, <br/> Gangtok, East Sikkim <br/>737-102</p>
            </div>
        </div>
        {/* <!-- Files Section --> */}
        <div class="extra-info">
            <div class="icon">
                <img src="/logos/Files Icon.png" alt='files'/>
            </div>
            <div class="details">
                <h2>Files</h2>
                <button>File 1</button>
                <button>File 2</button>
            </div>
        </div>
    </div>
    {/* <!-- Register Buttons --> */}
    <div class="third-info">
        <button class="volunteers">Register as Volunteers</button>
        <button class="participants">Register as Participants</button>
    </div>



    {/* <div className="event-details">
      <p>{eventDetails.description}</p>
      <p>Date: {new Date(eventDetails.start_date).toLocaleDateString()}</p>
      <p>End Date: {new Date(eventDetails.end_date).toLocaleDateString()}</p>
      <p>Venue: {eventDetails.venue}</p>
      <p>Participant Strength: {eventDetails.participant_strength}</p>
      <p>Category: {eventDetails.category}</p>
      <h3>Coordinator: {eventDetails.coordinator_name}</h3>
      {eventDetails.sub_events_titles && eventDetails.sub_events_titles.length > 0 && (
        <>
          <h3>Sub Events:</h3>
          <ul>
            {eventDetails.sub_events_titles.map((title, index) => (
              <li key={index}>{title} - Coordinator: {eventDetails.sub_events_coordinators[index]}</li>
            ))}
          </ul>
        </>
      )}
    </div> */}
    <Footer/>
    </>
  );
};

export default EventDetails;
