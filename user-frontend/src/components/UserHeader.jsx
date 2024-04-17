import React, { useState } from 'react'
import { signOut } from "firebase/auth";
import { auth, db } from '../backend/Firebase';
import { Navigate, useNavigate } from 'react-router-dom';
import hrdcLogo from '../assets/images/hrdc-logo-1.png'
import { Link } from "react-router-dom";
import {doc, getDoc} from 'firebase/firestore';
import "./header.css"
import { useEffect } from 'react';


export default function Header({user}) {
  const navigate = useNavigate()
  const [userName, setUserName] = useState(null)

  useEffect(()=>{
    const getUserName = async() => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      setUserName(docSnap.data().name)
    }
    if(user) getUserName()
    
  },[user])

  const userSignOut = () => {
    signOut(auth)
    .then(() => {
        navigate("/login");
    })
    .catch((error) => {
        // An error happened
        // TODO: Add error handling
    })
  }

  return (
    <div className='header'>
        <div style={{display: 'flex', alignItems: "center", color: "white"}}><img className="logo" src={hrdcLogo} alt="hrdc Logo"/>
        <p className='siteTitle' style={{padding: "1rem", fontWeight: "Bold"}}>Maintenance Portal</p>
        </div>
        <div className='navContainer'>
          {user ? "" : <Link className='navLink' to="/login">Login</Link>}       
          {user ? "" : <Link className='navLink' to="/register">Register</Link>}
          {user ? <p style={{color:"white", fontWeight: "Bold", alignSelf: "center", paddingRight: "1rem"}}>Welcome, {userName}</p> : ""}
          {user ? <p className='navLink' style={{background:"#97c33c", padding:".5rem", borderRadius: "10px"}} onClick={userSignOut}>Sign Out</p> : ""}
        </div>
    </div>
  )
}
