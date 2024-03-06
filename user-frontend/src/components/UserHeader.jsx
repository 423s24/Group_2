import React from 'react'
import { signOut } from "firebase/auth";
import { auth } from '../backend/Firebase';
import { Navigate, useNavigate } from 'react-router-dom';
import hrdcLogo from '../assets/images/hrdc-logo-1.png'
import { Link } from "react-router-dom";
import "./header.css"




export default function Header({user}) {
  const navigate = useNavigate()

  const userSignOut = () => {
    signOut(auth)
    .then(() => {
        navigate("../login");
    })
    .catch((error) => {
        // An error happened
        // TODO: Add error handling
    })
  }

  return (
    <div className='header'>
        <img className="logo" src={hrdcLogo} alt="hrdc Logo"/>
        <div className='navContainer'>
          {!user && <Link className='navLink' to="/login">Login</Link>}       
          {!user && <Link className='navLink' to="/register">Register</Link>}
          {user && <Link className='navLink' to="/maintenance">Maintenance</Link>}
          {user && <p className='navLink' onClick={userSignOut}>Sign Out</p>}
        </div>
    </div>
  )
}
