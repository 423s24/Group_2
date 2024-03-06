import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Backend/Firebase";
import HRDCLogo from "../../Assets/hrdc-logo-1.png";
import { Helmet } from 'react-helmet';
import "../Styling/register.css";
import { doc, setDoc } from "firebase/firestore";

function RegisterPage () {
    
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notice, setNotice] = useState("");
    const [registerStatus, setRegisterStatus] = useState(true);
    const [user, setUser] = useState(null);

    const createWithUsernameAndPassword = async (e) => {
        e.preventDefault();
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Properly signed in
            const newUser = userCredential.user;
            setUser(newUser);
    
            try {
                const docRef = await setDoc(doc(db, "users", newUser.uid), {
                    name: name,
                    phone: phoneNumber,
                    email: newUser.email,
                    role: "admin"
                });
                console.log("Document written with ID: ", newUser.uid);
            } catch (error) {
                console.error("Error adding document: ", error);
            }
    
            navigate("../");
        } catch (error) {
            setRegisterStatus(false);
            setNotice(`${error.code} : ${error.message}`);
        }
    }

    return (
        <div className="register-page">
            <Helmet>
                <title>HRDC Maintenance | Register</title>
            </Helmet>
            <div className="container">
                <a href="https://thehrdc.org">
                    <img className="register-logo" src={HRDCLogo} alt="hrdc-logo"/>
                </a>
                <div className="register-container">
                    <h1 className="register-header">Welcome to the HRDC Maintenance Ticket Manager Portal</h1>
                    <h4 className="register-subheader">Register a New Account</h4>
                    <form className="register-form">

                        { "" !== notice &&
                            <div className="alert-warning" role="alert">
                                {notice}
                            </div>
                        }

                        <div className={`input-group ${registerStatus ? '' : 'input-group-error'}`}>
                            <input type="text" value={ name } onChange={ (e) => setName(e.target.value) } required/>
                            <label for="">Name</label>
                        </div>
                        <div className={`input-group ${registerStatus ? '' : 'input-group-error'}`}>
                            <input type="tel" value={ phoneNumber } onChange={ (e) => setPhoneNumber(e.target.value) } required/>
                            <label for="">Phone Number</label>
                        </div>

                        <div className={`input-group ${registerStatus ? '' : 'input-group-error'}`}>
                            <input type="text" value={ email } onChange={ (e) => setEmail(e.target.value) } required/>
                            <label for="">Email</label>
                        </div>
                        <div className={`input-group ${registerStatus ? '' : 'input-group-error'}`}>
                            <input type="password" value={ password } onChange={ (e) => setPassword(e.target.value) } required />
                            <label for="">Password</label>
                        </div>
                        <button className="register-button" onClick={ (e) => createWithUsernameAndPassword(e) }>Sign Up</button>
                        <p className="forgot-password-text">Have an account already? <a href="../login">Click Here</a> to sign in.</p>
                    </form>
                </div>
            </div>
            <div className="image-container">
                <img src="https://thehrdc.org/wp-content/uploads/2020/11/RPM-Contact-scaled.jpg" />
            </div>
        </div>
    )
}

export default RegisterPage;