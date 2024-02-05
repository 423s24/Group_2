import "./login.css";
import HRDCLogo from "../Assets/hrdc-logo-1.png";
import { Helmet } from 'react-helmet';

function LoginPage() {
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
                    <form className="login-form">
                        <div className="input-group">
                            <input type="text"required/>
                            <label for="">Email</label>
                        </div>
                        <div className="input-group">
                            <input type="password" required />
                            <label for="">Password</label>
                        </div>
                        <button className="login-button">Sign In</button>
                        <p className="forgot-password-text">Forgot your password? <a href="#">Click Here</a> to reset it.</p>
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