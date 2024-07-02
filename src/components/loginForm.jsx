import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../utils/firebaseConfig';
import './styles.css';

const LoginFormPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const submitButton = document.getElementById('submit-btn');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (submitButton && loginForm && usernameInput && passwordInput) {
      const handleMouseOver = () => {
        if (usernameInput.value === '' || passwordInput.value === '') {
          const offsetX = Math.random() * (window.innerWidth - submitButton.offsetWidth);
          const offsetY = Math.random() * (window.innerHeight - submitButton.offsetHeight);
          submitButton.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
      };

      const handleInput = () => {
        if (usernameInput.value !== '' && passwordInput.value !== '') {
          submitButton.style.transform = 'translate(0, 0)';
        }
      };

      submitButton.addEventListener('mouseover', handleMouseOver);
      loginForm.addEventListener('input', handleInput);

      return () => {
        submitButton.removeEventListener('mouseover', handleMouseOver);
        loginForm.removeEventListener('input', handleInput);
      };
    }
  }, []);

  const handleLogin = async () => {
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      navigate('/db');
    } catch (error) {
      handleFirebaseError(error);
    }
  };

  const handleResetPassword = async () => {
    const email = document.getElementById('username').value;

    if (email === '') {
      toast.error('Please enter your email before clicking on forget password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent. Please check your inbox.', {
        toastId: 'reset-password-toast', // Ensure unique ID to manage the toast
        bodyClassName: 'toast-body-success', // CSS class for the success toast body
      });
    } catch (error) {
      handleFirebaseError(error);
    }
  };

  const handleFirebaseError = (error) => {
    let errorMessage = 'An error occurred. Please try again.';
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No user found with this email.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email format.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'User account is disabled.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many requests. Please try again later.';
        break;
      default:
        break;
    }
    toast.error(`Login failed: ${errorMessage}`);
  };

  if (loggedIn) {
    navigate('/db', { replace: true });
    return null; // Redirecting programmatically, returning null to avoid rendering anything
  }

  return (
    <div>
      <div id="particles-js"></div>
      <div className="glow-container">
        <div className="glow-text">Welcome To</div>
        <div className="glow-text">PulseZest</div>
      </div>
      
      <div className="container">
        <div className="login-box">
          <h2 className="headline">Login</h2>
          <form id="loginForm">
            <div className="user-box">
              <input type="text" id="username" name="username" required />
              <label htmlFor="username" className="active">Email</label>
            </div>
            <div className="user-box">
              <input type={showPassword ? "text" : "password"} id="password" name="password" required />
              <label htmlFor="password" className="active">Password</label>
              <span className="eye-icon" onClick={handleTogglePassword}>{showPassword ? "👁️" : "👁️‍🗨️"}</span>
            </div>
            <a   id="submit-btn" onClick={handleLogin}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Submit
            </a>
            <p className="forgot-password" onClick={handleResetPassword} style={{ color: '#fff', cursor: 'pointer' }}>Forgot your password?</p>
          </form>
        </div>
      </div>

      <ToastContainer
        bodyClassName={{
          success: 'toast-body-success',
          error: 'toast-body-error',
        }}
      />
    </div>
  );
};

export default LoginFormPage;
