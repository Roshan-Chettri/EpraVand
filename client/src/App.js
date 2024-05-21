import React from 'react';
import {  
  BrowserRouter as Router,  
  Routes,  
  Route,  
}   
from 'react-router-dom';  
import LandingPage from './components/landing page';
import Register from './components/coordinator/register';
import './App.css';
import Login from './components/coordinator/login';
import Dashboard from './components/coordinator/dashboard';
import ProtectedRoute from './components/coordinator/ProtectedRoute';


function App() {
  
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login/>} />
          <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
          {/* Add routes for other pages */}
        </Routes>
      </Router>
    </div>
  )
}

export default App;

