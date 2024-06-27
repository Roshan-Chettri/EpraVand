import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddSubEventDetailsForm = ({ subEvent, onClose, refresh }) => {
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [participantStrength, setParticipantStrength] = useState('');
  const [typeId, setTypeId] = useState('');
  const [types, setTypes] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/event-types', { withCredentials: true });
        setTypes(response.data);
      } catch (error) {
        console.error('Error fetching event types:', error);
      }
    };
    fetchEventTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subEventData = {
      description,
      venue,
      participant_strength: participantStrength,
      type: typeId, 
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime,
    };

    try {
      await axios.post(`http://localhost:5000/sub-events/${subEvent.sub_event_id}/details`, subEventData, { withCredentials: true });
      toast.success('Sub-event details added successfully!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      onClose();
      refresh();
    } catch (error) {
      console.error('Error adding sub-event details:', error);
      toast.error('Error adding sub-event details!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div className="information-section">
      <h2>Add Details for {subEvent.title}</h2>
      <form onSubmit={handleSubmit} className='add-event-form'>
          <textarea
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Event Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Participant Strength"
            value={participantStrength}
            onChange={(e) => setParticipantStrength(e.target.value)}
            required
          />

          <select
            name="type"
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
            className="internal-external"
            required
          >
            <option value="">Select Type</option>
            {types.map((type) => (
              <option key={type.event_type_id} value={type.type_name}>
                {type.type_name}
              </option>
            ))}
          </select>
          
    
        <div className="date-time">
          <div className="fields">
            <label>Starting Date</label>
            <br />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="fields">
            <label>Starting Time</label>
            <br />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="date-time">
          <div className="fields">
            <label>Ending Date</label>
            <br />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="fields">
            <label>Ending Time</label>
            <br />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="submit-section">
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubEventDetailsForm;
