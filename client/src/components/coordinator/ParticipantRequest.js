import React, { useEffect, useState } from "react";
import axios from "axios";
import './ParticipantRequest.css';

const ParticipantRequest = () => {
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        fetchParticipants();
    }, []);

    const fetchParticipants = async () => {
        try {
            const response = await axios.get("http://localhost:5000/new-participants");
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

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:5000/approve-participant/${id}`);
            // Update local state to reflect the approval
            const updatedParticipants = participants.map(participant =>
                participant.id === id ? { ...participant, is_approved: true } : participant
            );
            setParticipants(updatedParticipants);
            fetchParticipants();
        } catch (error) {
            console.error('Error approving participant:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`http://localhost:5000/reject-participant/${id}`);
            // Update local state to reflect the rejection
            const updatedParticipants = participants.map(participant =>
                participant.id === id ? { ...participant, is_approved: false } : participant
            );
            setParticipants(updatedParticipants);
            fetchParticipants();
        } catch (error) {
            console.error('Error rejecting participant:', error);
        }
    };

    if (participants.length === 0) {
        return <div className='not-found'>No New Request</div>;
    }

    return (
        <div className="information_section">
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
                        <React.Fragment key={participant.id}>
                            <tr>
                                <td>{participant.fullname}</td>
                                <td>{participant.registernumber}</td>
                                <td>{participant.events.join(", ")}</td>
                                <td>
                                    <button
                                        className="more-details"
                                        onClick={() => toggleDetails(index)}
                                    >
                                        Details
                                    </button>
                                    <button
                                        className="approve"
                                        onClick={() => handleApprove(participant.id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="reject"
                                        onClick={() => handleReject(participant.id)}
                                    >
                                        Reject
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
                                                    <td>{participant.fullname}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Register Number</td>
                                                    <td>{participant.registernumber}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Gender</td>
                                                    <td>{participant.gender}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Date Of Birth</td>
                                                    <td>{participant.dob}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Email ID</td>
                                                    <td>{participant.email}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Contact Number</td>
                                                    <td>{participant.contactnumber}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Event</td>
                                                    <td>{participant.events.join(", ")}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Sub Events</td>
                                                    <td>{participant.subevents && participant.subevents.filter(se => se !== null).join(", ")
                                                            ? participant.subevents.filter(se => se !== null).join(", "): "N/A"
                                                        }</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Institution</td>
                                                    <td>{participant.institutionname}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Department</td>
                                                    <td>{participant.department}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Course</td>
                                                    <td>{participant.course}</td>
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
    );
};

export default ParticipantRequest;
