// App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/authService';
import Login from './components/Login';
import Registration from './components/Registration';
import LoginVerify from './components/LoginVerify'; 

import Dashboard from './components/Dashboard';
import Properties from './components/Properties';
// import ProductAddUpdate from './components/ProductAddUpdate';

import Members from './components/Members';
import MemberAddUpdate from './components/MemberAddUpdate';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(authService.isAuthenticated());
    };

    // Event listener for auth changes
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      // Cleanup
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/users/verify-login/:loginToken" element={<LoginVerify />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}>

           <Route path="members" element={<Members />} />
           <Route path="/dashboard/add-member" element={<MemberAddUpdate mode="add" />} />
           <Route path="/dashboard/view-member/:memberId" element={<MemberAddUpdate mode="view" />} />
           <Route path="/dashboard/edit-member/:memberId" element={<MemberAddUpdate mode="edit" />} />
         

          <Route path="properties" element={<Properties />} />



          {/* You can add more nested routes here */}
        </Route>
  {/* Redirect to Index as a fallback */}
    <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
