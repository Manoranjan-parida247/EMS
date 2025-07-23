import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Box, } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';


const Layout = () => {
    const { auth } = useAuth()


    if (!auth.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>


    );
};

export default Layout;
