import './App.css';
import Registration from './register/Registration';
import MaintenanceForm from './maintenance-request/MaintenanceForm';
import Header from './components/UserHeader';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './login/Login';
import {useState, useEffect} from 'react'
import { auth } from './backend/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ProtectedRoute } from './backend/ProtectedRoute';
import LoaderScreen from './components/loadingScreen';

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
    return <LoaderScreen />
  }

  return (
    <Router>
      <Header user={user}/>
        <div className='spanFull'>
        <Routes>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Registration/>} />
          <Route path="maintenance" element={<ProtectedRoute user={user}><MaintenanceForm /></ProtectedRoute>} />
          <Route path="loading" element={<LoaderScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
