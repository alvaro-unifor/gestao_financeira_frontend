// src/App.jsx
import React, { useState } from 'react';
import AuthComponent from './components/AuthComponent.jsx';
import Dashboard from './components/Dashboard.jsx';
import './index.css';

const App = () => {
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');

    const handleLoginSuccess = (token, userId) => {
        console.log('Login successful:', token, userId);
        setToken(token);
        setUserId(userId);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {token ? (
                <Dashboard token={token} 
                           userId={userId}
                />
            ) : (
                <AuthComponent onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default App;