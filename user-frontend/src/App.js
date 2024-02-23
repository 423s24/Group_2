import logo from './logo.svg';
import './App.css';
import './global.css';
import Registration from './registartion/Registration';
import MaintenanceForm from './maintenance-request/MaintenanceForm';
import Header from './components/UserHeader';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './login/Login';

function App() {
  return (
    <Router>
      <Header/>
        <div className='spanFull'>
        <Routes>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Registration/>} />
          <Route path="maintenance" element={<MaintenanceForm/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
