import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './useAuth';

const ProtectedRoute = () => {
    const { authenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a spinner or any loading component
    }

    return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
