import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import authService from './services/authService';
import './custom-styles.css';
import { Layout } from 'antd';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

    useEffect(() => {
        const userToken = authService.getToken();
        setIsLoggedIn(!!userToken);
        setIsAuthCheckComplete(true);
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        authService.logout();
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                {isLoggedIn && <Sidebar onLogout={handleLogout} />}
                <Layout>
                    <Routes>
                        <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="/" element={<Navigate replace to="/login" />} />
                        <Route path="/dashboard" element={isAuthCheckComplete && (isLoggedIn ? <MainContent /> : <Navigate replace to="/login" />)}>
                            <Route path="products" element={isAuthCheckComplete && (isLoggedIn ? <ProductList /> : <Navigate replace to="/login" />)} />
                            <Route path="add-product" element={<AddProduct mode="add" />} />
                            {/* Add other nested routes under dashboard if needed */}
                        </Route>
                        {/* Add other routes here if needed */}
                    </Routes>
                </Layout>
            </Layout>
        </Router>
    );
}

export default App;
