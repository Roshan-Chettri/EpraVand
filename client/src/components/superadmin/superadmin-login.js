import React from 'react';
import Login from '../login/login';

const SuperAdminLogin = () => {
    return <Login role_id={1} user = {"SUPER-ADMIN"} />;
};

export default SuperAdminLogin;
