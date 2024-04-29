import './App.css';
import Registration from './register/Registration';
import MaintenanceForm from './maintenance-request/MaintenanceForm';
import Header from './components/UserHeader';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from './login/Login';
import {useState, useEffect} from 'react'
import { auth } from './backend/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ProtectedRoute } from './backend/ProtectedRoute';
import LoaderScreen from './components/loadingScreen';
import Home from './home/home';
import ForgotPassword from './passwordReset/forgotPassword';
import UserMessageApp from './home/userMessagaApp';
import Footer from './components/footer';

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
          <Route path="login" element={<Login user={user}/>}/>
          <Route path="register" element={<Registration/>} />
          <Route path="/" element={<ProtectedRoute user={user}><Home user={user}/></ProtectedRoute>} />
          <Route path="maintenance" element={<ProtectedRoute user={user}><MaintenanceForm /></ProtectedRoute>} />
          <Route path="loading" element={<LoaderScreen />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/messages/:threadId" element={<UserMessageApp />} />
        </Routes>
      </div>
      {/* <Footer/> */}
    </Router>
  );
}

export default App;
