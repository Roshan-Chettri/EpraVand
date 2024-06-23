import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import Header from "../header";
import Footer from "../footer";
import './registration.css';
import {toast } from 'react-toastify';

const Registration = () => {
    const { eventId } = useParams();
    const [institutions, setInstitutions] = useState([]);
    const [subEvents, setSubEvents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [fullName, setFullName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [gender, setGender] = useState(''); // Add state for gender
    const [dob, setDob] = useState(''); // Add state for date of birth
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [selectedInstitution, setSelectedInstitution] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSubEvent, setSelectedSubEvent] = useState('');



    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/registration-details/${eventId}`);
                const { institutions, subEvents, courses, departments } = response.data;
                setInstitutions(institutions);
                setSubEvents(subEvents);
                setCourses(courses);
                setDepartments(departments);
            } catch (error) {
                console.error('Error fetching registration details:', error);
            }
        };

        fetchDetails();
    }, [eventId]); // Fetch details when eventId changes

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Convert gender to a single character
        const genderMap = {
            male: 'M',
            female: 'F'
        };
    
        // Prepare data to send to the backend
        const formData = {
            eventId,
            participantDetails: {
                fullName,
                rollNumber,
                gender: genderMap[gender], // Convert gender to single character
                dob,
                email,
                contactNumber,
                institution: parseInt(selectedInstitution, 10), // Convert to integer
                department: parseInt(selectedDepartment, 10), // Convert to integer
                course_id: parseInt(selectedCourse, 10) // Convert to integer
            },
            selectedSubEvent: parseInt(selectedSubEvent, 10) || null // Convert to integer or null if not selected
        };
    
        try {
            // Send POST request to backend
            const response = await axios.post('http://localhost:5000/participant-registration', formData);
            console.log('Registration successful:', response.data);
            toast.success('Registration Successfull!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            // Reset the form fields after successful submission
            setFullName('');
            setRollNumber('');
            setGender('');
            setDob('');
            setEmail('');
            setContactNumber('');
            setSelectedInstitution('');
            setSelectedDepartment('');
            setSelectedCourse('');
            setSelectedSubEvent('');
    
        } catch (error) {
            console.error('Error submitting registration:', error);
            toast.error('Error Registering!', {
                position: "top-center",
                autoClose: 2000,
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
        <>
            <Header/>
            <form onSubmit={handleSubmit} className="participant-form">
                <h2>FILL IN THE DETAILS</h2>
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="full-name" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Roll No. / Register No." 
                    className="r-number" 
                    value={rollNumber} 
                    onChange={(e) => setRollNumber(e.target.value)} 
                    required 
                />

                <div className="gen-dob">
                    <div className="gender-dob">
                        <label htmlFor="gender">Gender</label>
                        <select 
                            className="gen" 
                            value={gender} 
                            onChange={(e) => setGender(e.target.value)} 
                            required
                        >
                            <option value="">Select your option</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="gender-dob">
                        <label htmlFor="dob">Date of Birth</label>
                        <input 
                            type="date" 
                            className="d-o-b" 
                            value={dob} 
                            onChange={(e) => setDob(e.target.value)} 
                            required 
                        />
                    </div>
                </div>
                
                <input 
                    type="email" 
                    placeholder="Email ID" 
                    className="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="tel" 
                    placeholder="Contact number" 
                    className="contact" 
                    value={contactNumber} 
                    onChange={(e) => setContactNumber(e.target.value)} 
                    required 
                />
                
              
                   
                {subEvents.length > 0 && (
                    <div className="dropdown">

                        <select 
                            id="subEvent" 
                            value={selectedSubEvent} 
                            onChange={(e) => setSelectedSubEvent(e.target.value)} 
                            required
                        >
                            <option value="">Select sub-event</option>
                            {subEvents.map(subEvent => (
                                <option key={subEvent.sub_event_id} value={subEvent.sub_event_id}>
                                    {subEvent.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
              

                <select 
                     className="institution" 
                     value={selectedInstitution} 
                     onChange={(e) => setSelectedInstitution(e.target.value)} 
                      required
                    >
                     <option value="">Select your institution</option>
                     {institutions.map(institution => (
                         <option key={institution.institution_id} value={institution.institution_id}>
                             {institution.institution_name}
                         </option>
                     ))}
                </select>


                <div className="dept-course">
                    <div className="department-course">
                        <label htmlFor="department">Department/Stream</label>
                        <select 
                            className="depart" 
                            value={selectedDepartment} 
                            onChange={(e) => setSelectedDepartment(e.target.value)} 
                            required
                        >
                         <option value="">Select your option</option>
                         {departments.map(department => (
                             <option key={department.department_id} value={department.department_id}>
                                 {department.department_name}
                             </option>
                          ))}
                        </select>

                    </div>
                    <div className="department-course">
                        <label htmlFor="course">Course/Class</label>
                        <select 
                             className="cou" 
                             value={selectedCourse} 
                             onChange={(e) => setSelectedCourse(e.target.value)} 
                             required
                            >
                             <option value="">Select your option</option>
                             {courses.map(course => (
                                 <option key={course.course_id} value={course.course_id}>
                                     {course.course_name}
                                 </option>
                             ))}
                        </select>

                    </div>
                </div>
                <button type="submit" className="submit-btn">SUBMIT</button>
            </form>
            <Footer/>
        </>
    );
};

export default Registration;
