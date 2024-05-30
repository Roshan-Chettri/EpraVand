import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './useAuth';

const ProtectedRoute = () => {
    const { authenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; 
    }

    return authenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
