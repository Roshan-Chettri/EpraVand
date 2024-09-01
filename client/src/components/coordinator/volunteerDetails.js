import React, { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from 'react-csv';
import './ParticipantRequest.css'; // Reusing the same CSS file for styling

const VolunteerDetails = () => {
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/volunteers", { withCredentials: true });
            setVolunteers(response.data);
        } catch (error) {
            console.error('Error fetching volunteers:', error);
        }
    };

    const toggleDetails = (index) => {
        const updatedVolunteers = [...volunteers];
        updatedVolunteers[index].showDetails = !updatedVolunteers[index].showDetails;
        setVolunteers(updatedVolunteers);
    };

    if (volunteers.length === 0) {
        return <div className='not-found'>No Volunteers Found</div>;
    }

     // Define CSV headers
     const headers = [
        { label: 'Name', key: 'name' },
        { label: 'Registration Number', key: 'reg_no' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' }
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
                    {volunteers.map((volunteer, index) => (
                        <React.Fragment key={volunteer.volunteer_id}>
                            <tr>
                                <td>{volunteer.name}</td>
                                <td>{volunteer.reg_no}</td>
                                <td>{volunteer.event_title}</td>
                                <td>
                                    <button
                                        className="more-details"
                                        onClick={() => toggleDetails(index)}
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                            {volunteer.showDetails && (
                                <tr className="details">
                                    <td colSpan="4">
                                        <table className="details-content">
                                            <tbody>
                                                <tr>
                                                    <td className="details-title">Full Name</td>
                                                    <td>{volunteer.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Register Number</td>
                                                    <td>{volunteer.reg_no}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Email</td>
                                                    <td>{volunteer.email}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Phone</td>
                                                    <td>{volunteer.phone}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Course</td>
                                                    <td>{volunteer.course_name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="details-title">Event</td>
                                                    <td>{volunteer.event_title}</td>
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
                <CSVLink data={volunteers} headers={headers} filename={"volunteers.csv"}>
                    Download Volunteer List
                </CSVLink>
            </div>
        
        </>
    );
};

export default VolunteerDetails;
