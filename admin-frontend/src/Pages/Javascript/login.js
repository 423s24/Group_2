import "../Styling/login.css";
import HRDCLogo from "../../Assets/hrdc-logo-1.png";
import { Helmet } from 'react-helmet';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../Backend/Firebase";
import {doc, getDoc} from "firebase/firestore";

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
            //User is signed in 
            const user = userCredential.user;
            return user;
        })
        .then(async (user) => {
            //this is insecure
            //We need to do this with cloud functions so it runs on server
            //to use cloud function we need to update our plan
            const info = await getDoc(doc(db, "users", user.uid));
            if(info.data().role === "admin"){
                navigate("/");
            }else{
              signOut(auth)
              setNotice("User does not have correct permissions.")
              console.log("user does not have credential")
            }
        })
        .catch((error) => {
            setNotice("Invalid Email or Password");
            setLoginStatus(false);
        });
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
                            <label htmlFor="">Email</label>
                        </div>
                        <div className={`input-group ${loginStatus ? '' : 'input-group-error'}`}>
                            <input type="password" value={ password } onChange={ (e) => setPassword(e.target.value) } required />
                            <label htmlFor="">Password</label>
                        </div>
                        <button className="login-button" onClick={ (e) => loginWithUsernameAndPassword(e) }>Sign In</button>
                        <p className="forgot-password-text">Forgot your password? <a href="../forgot-password">Click Here</a> to reset it.</p>
                    </form>
                </div>
            </div>
            <div className="image-container">
                <img src="https://thehrdc.org/wp-content/uploads/2020/11/RPM-Contact-scaled.jpg" alt="homes"/>
            </div>
        </div>
        
    )
}

export default LoginPage;