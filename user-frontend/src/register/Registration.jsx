import {React, useEffect, useRef, useState} from 'react'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./register.css";
import { auth, db } from "../backend/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

//regular expressions for string validation
const USER_REGEX = /^[^\d\s]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


export default function Registration() {
  
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const errRef = useRef();

  const [firstName, setFirstName] = useState('');
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState('');
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notice, setNotice] = useState("");
  const [registerStatus, setRegisterStatus] = useState(true);

  const [emailNotification, setEmailNotification] = useState(true); 
  const createWithUsernameAndPassword = async (e) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pwd);
        // Properly signed in
        const newUser = userCredential.user;
  
        try {
            const docRef = await setDoc(doc(db, "users", newUser.uid), {
                name: firstName,
                phone: phoneNumber,
                email: newUser.email,
                role: "tenant"
            });
            console.log("Document written with ID: ", newUser.uid);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        navigate("/maintenance");
    } catch (error) {
        setRegisterStatus(false);
        setNotice(`${error.code} : ${error.message}`);
    }
}

  //Checking if input string is valid compared to regular expression
  useEffect(() => {
      firstNameRef.current.focus();
  },[])

  useEffect(() => {
    setValidFirstName(USER_REGEX.test(firstName));
  }, [firstName])

  useEffect(() => {
    setValidLastName(USER_REGEX.test(lastName));
  }, [lastName])

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email])

  useEffect(() => {
      setValidPwd(PWD_REGEX.test(pwd));
      setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {
      setErrMsg('');
  }, [firstName, pwd, matchPwd])
  
  
  const handleSubmit = async (e) => {

   //making sure that you cant just enable the button in the browser
    e.preventDefault();
    const v1 = USER_REGEX.test(firstName);
    const v2 = USER_REGEX.test(lastName);
    const v3 = EMAIL_REGEX.test(email);
    const v4 = PWD_REGEX.test(pwd);
    if (!v1 || !v2 || !v3 || !v4) {
        setErrMsg("Invalid Entry");
        return;
    }

    console.log(firstName, lastName, email ,pwd)
    createWithUsernameAndPassword()
  }

  return (
    <div>
    <section className='form-section' style={{marginBottom: "10px"}}>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <div className='input-group'>
            <input
                type="text"
                id="firstname"
                ref={firstNameRef}
                autoComplete="off"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                required
                aria-invalid={validFirstName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setFirstNameFocus(true)}
                onBlur={() => setFirstNameFocus(false)}
              />
              <label htmlFor="firstname">
                First Name:
                <FontAwesomeIcon icon={faCheck} className={validFirstName ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validFirstName || !firstName ? "hide" : "invalid"} />
              </label>
               <p id="uidnote" className={firstNameFocus && firstName && !validFirstName ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Cannot contain numbers or spaces.
              </p>
              </div>
              <div className='input-group'>
            
            <input
                type="text"
                id="lastname"
                ref={lastNameRef}
                autoComplete="off"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                required
                aria-invalid={validLastName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setLastNameFocus(true)}
                onBlur={() => setLastNameFocus(false)}
              />
              <label htmlFor="lastname">
                Last Name:
                <FontAwesomeIcon icon={faCheck} className={validLastName ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validLastName || !lastName ? "hide" : "invalid"} />
              </label>
               <p id="uidnote" className={lastNameFocus && lastName && !validLastName ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Cannot contain numbers or spaces.
              </p>
              </div>
              <div className='input-group'>
            <input
                type="text"
                id="email"
                ref={emailRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
              <label htmlFor="lastname">
                Email:
                <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
              </label>
               <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Please enter a valid email: johnSmith@example.com
              </p>
              </div>
              <div className='input-group'>
              <input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
              />
              <label htmlFor="password">
                  Password:
                  <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
              </label>
              <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  8 to 24 characters.<br />
                  Must include uppercase and lowercase letters, a number and a special character.<br />
                  Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
              </p>
              </div>
              <div className='input-group'>
             
              <input
                  type="password"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
              />
               <label htmlFor="confirm_pwd">
                  Confirm Password:
                  <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
              </label>
              <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the first password input field.
              </p>
              </div>
              <div className='input-group-checkbox'>
              <label htmlFor="emailNotification">Receive Email Notifications:</label>
              <div>
              <input
                    type="checkbox"
                    id="emailNotificationYes"
                    checked={emailNotification}
                    onChange={() => setEmailNotification(true)}
              />
              <label htmlFor="emailNotificationYes">Yes</label>
              </div>
              <div>
              <input
                  type="checkbox"
                  id="emailNotificationNo"
                  checked={!emailNotification}
                  onChange={() => setEmailNotification(false)}
              />
              <label htmlFor="emailNotificationNo">No</label>
              </div>
              </div>
              <button className='login-button' disabled={!validFirstName || !validPwd || !validMatch ? true : false}>Register</button>
          </form>
    </section>
    <button style={{color: "#107178", padding:"5px 10px 5px 10px", marginBottom: "40px", marginTop: "40px", fontSize: "18px", width:"fit-content"}} onClick={() => {navigate("/login")}}>Back</button>
    </div>

  )
}
