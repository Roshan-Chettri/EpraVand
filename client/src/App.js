import React from 'react';
import {  
  BrowserRouter as Router,  
  Routes,  
  Route,  
}   
from 'react-router-dom';  
import LandingPage from './components/landing page';
import Header from './components/header';
import './App.css';


function App() {
  
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/header" element={<Header />} />
          {/* Add routes for other pages */}
        </Routes>
      </Router>
    </div>
  )
}

export default App;

