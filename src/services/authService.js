// authService.js
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL;



const login = (email, password) => {
    const API_URL = `${apiUrl}/users/login`;
    return axios.post(API_URL, { email, password })
        .then(response => {
            if (response.data.access) {
                
                // Dispatch an event when the auth status changes
                window.dispatchEvent(new Event('authChange'));
            }
            return response.data;
        });
};


const verifyLogin = (token) => {
    const API_URL = `${apiUrl}/users/verify-login/${token}`;
    
    return axios.get(API_URL)
        .then(response => {
            if (response.data.access) {
                localStorage.setItem('userToken', response.data.access);
                // Dispatch an event when the auth status changes
                window.dispatchEvent(new Event('authChange'));
            }
            return response.data;
        });
};


const getToken = () => {
    return localStorage.getItem('userToken');
};

const isAuthenticated = () => {
    const userToken = localStorage.getItem('userToken');
    return !!userToken; // Returns true if userToken exists, false otherwise
};

const logout = () => {
    localStorage.removeItem('userToken');
    // Dispatch an event when the auth status changes
    window.dispatchEvent(new Event('authChange'));
};

const authService = {
    login,
    verifyLogin,
    getToken,
    isAuthenticated,
    logout,
};

export default authService;
