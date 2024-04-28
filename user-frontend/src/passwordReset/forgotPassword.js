import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../backend/Firebase';
import "./forgotPassword.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');
  const navigate = useNavigate();

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
    <div style={{minHeight: "100vh"}}>
    <div className="form-section">
      <Helmet>
        <title>HRDC Maintenance | Forgot Password</title>
      </Helmet>
      <div className="container"> 
        <div className="login-container"> 
          <h1 className="login-header">Forgot Your Password?</h1> 
          <h4 className="login-subheader">Enter your email below to reset your password.</h4> 
          <form className="form"> 
            <div className="input-group"> 
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
            {notice && <div className="login-error">{notice}</div>} 
          </form>
        </div>
      </div>
    </div>
    <button style={{color: "#107178", padding:"5px 10px 5px 10px", fontSize: "18px", width:"fit-content"}} onClick={() => {navigate("/login")}}>Back</button>
    </div>
  );
};

export default ForgotPassword;