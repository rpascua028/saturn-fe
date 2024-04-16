import axios from 'axios';
import authService from './authService';
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom if using React Router v5

const apiUrl = process.env.REACT_APP_API_BASE_URL;

export const fetchGet = async (url, errorHandler = console.error) => {

  try {
    const fullUrl = `${apiUrl}/${url}`;
    const response = await axios.get(fullUrl, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    if (error.response && error.response.data.code === "token_not_valid") {
      // Check if the error code is related to token validation
      console.error('Token error:', error.response.data.detail);
      authService.logout(); // Clear the token and dispatch the auth change event

    } else if (errorHandler) {
      errorHandler(error);
    }
    return null;
  }
};
