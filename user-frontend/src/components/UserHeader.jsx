import React from 'react'
import hrdcLogo from '../assets/images/hrdc-logo-1.png'
import { Link } from "react-router-dom";
import "./header.css"

export default function Header() {
  return (
    <div className='header'>
        <img className="logo" src={hrdcLogo} alt="hrdc Logo"/>
        <div className='navContainer'>
        <Link className='naveLink' to="/login">Login</Link>       
            <Link className='navLink' to="/register">Register</Link>       
            <Link className='navLink' to="/maintenance">Maintenance</Link>
        </div>
    </div>
  )
}
