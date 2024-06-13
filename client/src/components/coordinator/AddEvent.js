import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {toast } from 'react-toastify';

import './AddEvent.css';

const EventForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [participantStrength, setParticipantStrength] = useState('');
  const [type, setType] = useState('');
  const [types, setTypes] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState('No file chosen');
  const [subEvents, setSubEvents] = useState([{ coordinator: '', title: '' }]);
 

  useEffect(() => {
    const fetchTypesAndCoordinators = async () => {
      try {
        const [typeRes, coordinatorRes] = await Promise.all([
          axios.get('http://localhost:5000/event-types', { withCredentials: true }),
          axios.get('http://localhost:5000/coordinators', { withCredentials: true })
        ]);
        setTypes(typeRes.data);
        setCoordinators(coordinatorRes.data);
      } catch (error) {
        console.error('Error fetching event types and coordinators:', error);
      }
    };
    fetchTypesAndCoordinators();
  }, []);

  const handleFileChange = (event) => {
    const fileArray = Array.from(event.target.files);
    setFiles(fileArray);
    setFileNames(fileArray.length ? fileArray.map(file => file.name).join(', ') : 'No file chosen');
  };

  const handleSubEventChange = (index, event) => {
    const values = [...subEvents];
    values[index][event.target.name] = event.target.value;
    setSubEvents(values);
  };

  const handleAddSubEvent = () => {
    setSubEvents([...subEvents, { coordinator: '', title: '' }]);
  };
  

  const handleRemoveSubEvent = (index) => {
    const values = [...subEvents];
    values.splice(index, 1);
    setSubEvents(values);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const eventData = {
      title,
      description,
      venue,
      participantStrength,
      type,
      startDate,
      startTime,
      endDate,
      endTime,
      subEvents: subEvents.filter(subEvent => subEvent.title && subEvent.coordinator)
    };

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('eventData', JSON.stringify(eventData));

    try {
        const response = await axios.post('http://localhost:5000/add-event', formData, { withCredentials: true });
        toast.success('Event Created Successfully!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        console.log('Event created successfully:', response.data);
        // Clear form fields on success
        setTitle('');
        setDescription('');
        setVenue('');
        setParticipantStrength('');
        setType('internal');
        setStartDate('');
        setStartTime('');
        setEndDate('');
        setEndTime('');
        setFiles([]);
        setFileNames('No file chosen');
        setSubEvents([{ coordinator: '', title: '' }]);
      } catch (error) {
        console.error('Error creating event:', error);
        toast.error('Error Creating Event!', {
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
      <form onSubmit={handleSubmit} className='add-event-form'>
        <h3>FILL THE EVENT DETAILS</h3>

        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="internal-external"
          required
        >
          <option value="">Select Event Type</option>
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

        <input
          type="file"
          id="real-file"
          hidden="hidden"
          multiple
          onChange={handleFileChange}
        />
        <button type="button" id="custom-button" onClick={() => document.getElementById('real-file').click()}>
          Upload files
        </button>
        <span id="custom-text">{fileNames}</span>

        <div className="sub-event-form">
          <p><b>Note: </b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, ipsum! Qui veniam earum eum cum eius voluptates, sequi quia accusantium!</p>
          <div className="fields">
            <h2>Add Sub-Events</h2>
            <button type="button" className="add" onClick={handleAddSubEvent}>
              +
            </button>
          </div>
          <div className="inp-group">
            {subEvents.map((subEvent, index) => (
              <div className="flex" key={index}>
                <input
                  type="text"
                  placeholder="Sub-Event Title"
                  name="title"
                  value={subEvent.title}
                  onChange={(event) => handleSubEventChange(index, event)}
                />
                <select
                  name="coordinator"
                  value={subEvent.coordinator}
                  onChange={(event) => handleSubEventChange(index, event)}
                  
                >
                  <option value="">Select Coordinator</option>
                  {coordinators.map((coordinator) => (
                    <option key={coordinator.user_id} value={coordinator.user_id}>
                      {coordinator.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="delete"
                  onClick={() => handleRemoveSubEvent(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EventForm;
