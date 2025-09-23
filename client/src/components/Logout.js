import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Simple Logout that can later clear tokens/state and then redirect to home
const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        try {
            // TODO: clear auth tokens/session if added later
            // localStorage.removeItem('authToken');
        } catch (e) {
            // ignore
        }
        // Redirect to landing page
        navigate('/', { replace: true });
    }, [navigate]);

    return null;
};

export default Logout;
