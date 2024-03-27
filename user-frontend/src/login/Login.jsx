import React from 'react';
import {useState, useRef, useEffect} from 'react'
import {Link, Navigate, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut} from "firebase/auth";
import { auth, db } from "../backend/Firebase";
import {doc, getDoc} from "firebase/firestore";

export default function Login({user}) {
  const userNameRef = useRef();
  const passwordRef = useRef();

 
  const navigate = useNavigate();
  const [notice, setNotice] = useState("");
  const [loginStatus, setLoginStatus] = useState(true);

  const [userName, setUserName] = useState('');
  const [validUserName, setValidUserName] = useState(false);
  const [userNameFocus, setUserNameFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  useEffect(()=>{
    if(user) {navigate("/home")}
  },[])


  const handleSubmit = async (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, userName, password)
    .then((userCredential) => {
        //User is signed in 
        const user = userCredential.user;
        return user;
    })
    .then((user) => {
        navigate("/home");    
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setNotice("Invalid Email or Password");
        setLoginStatus(false);
    });
}

  return (
    <section className='form-section'>
    <h1>Login</h1>
    <form className='input-form' onSubmit={handleSubmit}>
      <div className='input-group wide-input'>
      <input
          data-testid="email-input"
          type="text"
          id="username"
          ref={userNameRef}
          autoComplete="off"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          required
          aria-describedby="uidnote"
          onFocus={() => setUserNameFocus(true)}
          onBlur={() => setUserNameFocus(false)}
        />
        <label htmlFor="username">
          Email:
        </label>
        </div>
        <div className='input-group wide-input'>
      
      <input
          data-testid = "password-input"
          type="password"
          id="password"
          ref={passwordRef}
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          aria-describedby="uidnote"
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        />
        <label htmlFor="password">
          Password:
        </label>
        </div>
        <button className='login-button' data-testid="login-button">Login</button>
        </form>
        <p className='login-error' data-testid="login-notice">{notice}</p>
        <p>Forgot your password? <Link to="../forgot-password" style={{ color: '#000' }}>Reset it</Link></p>
       </section>

  )
}
