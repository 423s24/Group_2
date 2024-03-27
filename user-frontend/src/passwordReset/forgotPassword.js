import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../backend/Firebase';
import "./forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');

  const resetPasswordWithEmail = async (e) => {
    e.preventDefault();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setNotice('Password reset email sent! Please check your inbox.');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setNotice(`Error: ${errorCode} - ${errorMessage}`);
      });
  };

  return (
    <div className="form-section"> {/* Adjusted class name */}
      <Helmet>
        <title>HRDC Maintenance | Forgot Password</title>
      </Helmet>
      <div className="container"> {/* Adjusted class name */}
        <div className="login-container"> {/* Adjusted class name */}
          <h1 className="login-header">Forgot Your Password?</h1> {/* Adjusted class name */}
          <h4 className="login-subheader">Enter your email below to reset your password.</h4> {/* Adjusted class name */}
          <form className="form"> {/* Adjusted class name */}
            {notice && <div className="login-error">{notice}</div>} {/* Adjusted class name */}
            <div className="input-group"> {/* Adjusted class name */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email</label>
            </div>
            <button className="login-button" onClick={resetPasswordWithEmail}>
              Send Reset Email
            </button>
            <p className="forgot-password-text">
              You will receive an email with instructions on how to reset your password.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;