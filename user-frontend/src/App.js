import logo from './logo.svg';
import './App.css';
import './global.css';
import Registration from './registartion/Registration';
import MaintenanceForm from './maintenance-request/MaintenanceForm';
import Header from './components/UserHeader';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './login/Login';
import {useState, useEffect} from 'react'
import { auth } from './backend/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ProtectedRoute } from './backend/ProtectedRoute';


function App() {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsFetching(false);
        return;
      }

      setUser(null);
      setIsFetching(false);
    });

    return () => unsubscribe();
  }, []);

  if (isFetching) {
    return <h2>Loading...</h2>
  }

  return (
    <Router>
      <Header user={user}/>
        <div className='spanFull'>
        <Routes>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Registration/>} />
          <Route path="maintenance" element={<ProtectedRoute user={user}><MaintenanceForm /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
