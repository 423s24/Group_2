import {React, useState, useRef} from 'react'


export default function Login() {
  const userNameRef = useRef();
  const passwordRef = useRef();

  const [userName, setUserName] = useState('');
  const [validUserName, setValidUserName] = useState(false);
  const [userNameFocus, setUserNameFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const handleSubmit = async (e) => {
     console.log(userName, password)
}

  return (
    <section className='form-section'>
    <h1>Login</h1>
    <form onSubmit={handleSubmit}>
      <div className='input-group'>
      <input
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
        <div className='input-group'>
      
      <input
          type="text"
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
          Password
        </label>
        </div>
        <button className='login-button'>Login</button>
        </form>
       </section>
  )
}
