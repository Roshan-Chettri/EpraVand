import React from 'react';
import {  
  BrowserRouter as Router,  
  Routes,  
  Route,  
}   
from 'react-router-dom';  
import LandingPage from './components/landingpage/landing page';
import Register from './components/coordinator/register';
import ProtectedRoute from './components/login/ProtectedRoute';
import SuperAdminLogin from './components/superadmin/superadmin-login';
import AdminLogin from './components/admin/admin-login';
import Dashboard from './components/coordinator/dashboard';
import CoordinatorLogin from './components/coordinator/coordinator-login';
import AdminDashboard from './components/admin/admin-dashboard';
import SuperAdminDashboard from './components/superadmin/superadmin-dashboard';
import NotFound from './components/notFount';
import './App.css';
import { ToastContainer} from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';


function App() {
  
  return (
    <div>
      <ToastContainer/>
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path='/coordinator-login' element={<CoordinatorLogin/>}/>
          <Route exact path="/admin-login" element= {<AdminLogin/>}/>
          <Route exact path="/superadmin-login" element= {<SuperAdminLogin/>}/>
          <Route element={<ProtectedRoute />}>
            <Route path="/coordinator-dashboard" element={<Dashboard />}/>
            <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
            <Route path='/superadmin-dashboard' element={<SuperAdminDashboard/>}/>
          </Route>
          {/* Add routes for other pages */}

          {/* Catch-all route for undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;

