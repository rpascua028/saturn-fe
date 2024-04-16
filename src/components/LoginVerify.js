import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../services/authService';

const LoginVerify = () => {
  const { loginToken } = useParams();
  const navigate = useNavigate();
  const isVerifying = useRef(false); // Ref to track if verification is in progress

  useEffect(() => {
    // Prevent multiple invocations by checking the ref
    if (!isVerifying.current) {
      isVerifying.current = true; // Mark as in-progress
      authService.verifyLogin(loginToken)
        .then(() => {
          navigate('/dashboard'); // Redirect on success
        })
        .catch(() => {
          navigate('/login', {
            state: { error: 'The token is expired. Please try again.' },
          }); // Redirect back with error message
        });
    }
  }, [loginToken, navigate]); // Depend on loginToken and navigate

  return null; // Render nothing or a loading spinner
};

export default LoginVerify;
