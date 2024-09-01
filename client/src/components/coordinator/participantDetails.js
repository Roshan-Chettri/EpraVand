import React, { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import './ParticipantRequest.css'; // Reusing the same CSS file for styling

const ParticipantDetails = () => {
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        fetchParticipants();
    }, []);

    const fetchParticipants = async () => {
        try {
            const response = await axios.get('http://localhost:5000/participants', { withCredentials: true });
            setParticipants(response.data);
        } catch (error) {
            console.error('Error fetching participants:', error);
        }
    };

    const toggleDetails = (index) => {
        const updatedParticipants = [...participants];
        updatedParticipants[index].showDetails = !updatedParticipants[index].showDetails;
        setParticipants(updatedParticipants);
    };

    if (participants.length === 0) {
        return <div className='not-found'>No Participants Found</div>;
    }

      // Define CSV headers
      const headers = [
        { label: 'Full Name', key: 'name' },
        { label: 'Registration Number', key: 'reg_no' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Course', key: 'course_name' },
        { label: 'Event', key: 'event_title' }
    ];

    return (
        <><div className="information_section">
            <table className="participants-details">
                <thead>
                    <tr>
                        <th className="full-name">Full Name</th>
                        <th className="reg-no">Register Number</th>
                        <th className="table-events">Events</th>
                        <th className="actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {participants.map((participant, index) => (
                        <React.Fragment key={participant.participant_id}>
                            <tr>
                                <td>{participant.name}</td>
                                <td>{participant.reg_no}</td>
                                <td>{participant.event_title}</td>
                                <td>
                                    <button
                                        className="more-details"
                                        onClick={() => toggleDetails(index)}
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                            {participant.showDetails && (
                                <tr className="details">
                                    <td colSpan="4">
                                        <table className="details-content">
                                            <tbody>
                                                <tr>
                                                    <td className="details-title">Full Name</td>
                                                    <td>{participant.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Register Number</td>
                                                    <td>{participant.reg_no}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Email</td>
                                                    <td>{participant.email}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Phone</td>
                                                    <td>{participant.phone}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Course</td>
                                                    <td>{participant.course_name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Event</td>
                                                    <td>{participant.event_title}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="download-button">
                <CSVLink data={participants} headers={headers} filename={"participants.csv"}>
                    Download Participant List
                </CSVLink>
            </div>
        </>
    );
};

export default ParticipantDetails;
