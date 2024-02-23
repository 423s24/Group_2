import "../Styling/login.css";
import HRDCLogo from "../../Assets/hrdc-logo-1.png";
import { Helmet } from 'react-helmet';
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Backend/Firebase";

function LoginPage( {user} ) {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notice, setNotice] = useState("");
    const [loginStatus, setLoginStatus] = useState(true);

    const loginWithUsernameAndPassword = async (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User is signed in 
                const user = userCredential.user;
                navigate("../");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setNotice("Invalid Email or Password");
                setLoginStatus(false);
            });
    }

    if (user) {
        return <Navigate to='/' />
    }

    return (
        <div className="login-page">
            <Helmet>
                <title>HRDC Maintenance | Login</title>
            </Helmet>
            <div className="container">
                <a href="https://thehrdc.org">
                    <img className="login-logo" src={HRDCLogo} alt="hrdc-logo"/>
                </a>
                <div className="login-container">
                    <h1 className="login-header">Welcome to the HRDC Maintenance Ticket Manager Portal</h1>
                    <h4 className="login-subheader">Login to your Account</h4>
                    <p className="forgot-password-text">Don't have an account? <a href="../register">Click Here</a> to register.</p>
                    <form className="login-form">

                        { "" !== notice &&
                            <div className="alert-warning" role="alert">
                                {notice}
                            </div>
                        }

                        <div className={`input-group ${loginStatus ? '' : 'input-group-error'}`}>
                            <input type="text" value={ email } onChange={ (e) => setEmail(e.target.value) } required/>
                            <label for="">Email</label>
                        </div>
                        <div className={`input-group ${loginStatus ? '' : 'input-group-error'}`}>
                            <input type="password" value={ password } onChange={ (e) => setPassword(e.target.value) } required />
                            <label for="">Password</label>
                        </div>
                        <button className="login-button" onClick={ (e) => loginWithUsernameAndPassword(e) }>Sign In</button>
                        <p className="forgot-password-text">Forgot your password? <a href="../forgot-password">Click Here</a> to reset it.</p>
                    </form>
                </div>
            </div>
            <div className="image-container">
                <img src="https://thehrdc.org/wp-content/uploads/2020/11/RPM-Contact-scaled.jpg" />
            </div>
        </div>
        
    )
}

export default LoginPage;