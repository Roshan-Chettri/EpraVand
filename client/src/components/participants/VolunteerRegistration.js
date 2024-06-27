import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import {toast } from 'react-toastify';
import Header from "../header";
import Footer from "../footer";
import './VolunteerRegistration.css';

const VolunteerRegistration = () => {
    //Event Id form the route parameter
    const { eventId } = useParams();
    //States to set the options for dropdown menus
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    //Sates to set the user entered data/details
    const [fullName, setFullName] = useState('');
    const [rollNumber, setRollNumber] = useState('');  
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');


    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/registration-details/${eventId}`);
                const { subEvents, courses, departments } = response.data;
                setCourses(courses);
                setDepartments(departments);
            } catch (error) {
                console.error('Error fetching registration details:', error);
            }
        };

        fetchDetails();
    }, [eventId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
    
        // Prepare data to send to the backend
        const formData = {
            eventId,
            volunteerDetails: {
                fullName,
                rollNumber,
                email,
                contactNumber,
                course_id: parseInt(selectedCourse, 10) // Convert to integer
            }
        };

        try {
            // Send POST request to backend
            const response = await axios.post('http://localhost:5000/volunteer-registration', formData);
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


            setEmail('');
            setContactNumber('');
            setSelectedDepartment('');
            setSelectedCourse('');
   
    
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


    return (<>
    <Header/>
         <form onSubmit={handleSubmit} className="volunteer-form">
        <h2>VOLUNTEERS - FILL THE DETAILS</h2>
        <input 
                    type="text" 
                    placeholder="Full name" 
                    className="full-name" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Register number" 
                    className="r-number" 
                    value={rollNumber} 
                    onChange={(e) => setRollNumber(e.target.value)} 
                    required 
                />


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
       
        {/* <!-- Course/Class and Department/Stream --> */}
        <div class="dept-course">
            {/* <!-- Department or Stream --> */}
            <div class="department-course">
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
            {/* <!-- Course or Class --> */}
            <div class="department-course">
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
        {/* <!-- Submit Button --> */}
        <button type="submit" className="submit-btn">SUBMIT</button>
    </form>
    <Footer/>
    </>);
}

export default VolunteerRegistration;