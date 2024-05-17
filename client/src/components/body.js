import React, {useEffect, useState} from "react";
import Event from "./event";
import PastEvent from "./pastevent";

const Body = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await fetch('http://localhost:5000/events');
          if (!response.ok) {
            throw new Error("Failed to fetch events");
          }
          const data = await response.json();
          setEvents(data.data); // Extract events from the "data" property
        } catch (error) {
          console.error("Error fetching events:", error);
          setError("Failed to fetch events. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchEvents();
    }, []);
  
    return (
      <div className="main_body">
        {/* Upcoming Events */}
        <div className="upcoming_events">
          <h1>Dive Into Upcoming Excitements!</h1>
          <div className="event_section">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : events.length === 0 ? (
              <p>No upcoming events</p>
            ) : (
              events.map((event) => (
                <Event
                  key={event.event_id}
                  title={event.title}
                  description={event.description}
                  imagePath={event.file_path[0]} 
                  date={new Date(event.start_date).toLocaleDateString()} 
                  venue={event.venue}
                />
              ))
            )}
          </div>
        </div>
  
        {/* Past Events */}
        <div className="past_events">
          <h1>Explore Our Past Journey!</h1>
          <div className="p_events">
            <PastEvent 
              title="Athlon" 
              description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
              imagePath="logos/Singing image.jpg"
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default Body;