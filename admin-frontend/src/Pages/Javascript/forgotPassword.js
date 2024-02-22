import { Helmet } from "react-helmet";
import { auth } from "../../Backend/Firebase";
import HRDCLogo from "../../Assets/hrdc-logo-1.png";
import { useState } from "react";
import "../Styling/forgotPassword.css";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [validStatus, setValidStatus] = useState(true);
    const [notice, setNotice] = useState("");

    const resetPasswordWithEmail = async (e) => {
        e.preventDefault();

        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("Password reset email sent!");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setNotice(errorCode, ": ", errorMessage);
            })
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
                    <h1 className="login-header">Did you forget your password?</h1>
                    <h4 className="login-subheader">Enter your email below.</h4>
                    <form className="login-form">

                        { "" !== notice &&
                            <div className="alert-warning" role="alert">
                                {notice}
                            </div>
                        }

                        <div className={`input-group ${validStatus ? '' : 'input-group-error'}`}>
                            <input type="text" value={ email } onChange={ (e) => setEmail(e.target.value) } required/>
                            <label for="">Email</label>
                        </div>
                        <button className="login-button" onClick={ (e) => resetPasswordWithEmail(e) }>Send Reset Email</button>
                        <p className="forgot-password-text">You will be sent an email to reset your password.</p>
                    </form>
                </div>
            </div>
            <div className="image-container">
                <img src="https://thehrdc.org/wp-content/uploads/2020/11/RPM-Contact-scaled.jpg" />
            </div>
        </div>
    )
}

export default ForgotPassword;