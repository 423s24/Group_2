import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Javascript/login';
import HomePage from './Pages/Javascript/home';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Backend/Firebase';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from './Backend/ProtectedRoute';
import RegisterPage from './Pages/Javascript/register';
import ForgotPassword from './Pages/Javascript/forgotPassword';
import MessageApp from "./Pages/Javascript/MessageApp";
import TicketLoader from './Pages/Javascript/ticketLoader';
import EditTicket from './Pages/Javascript/EditTicket';
import LoadingScreen from './components/LoadingScreen';
import Loading from 'react-loading';

function useAuth() {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      console.log("User state changed:", authUser); // Log user state
      try {
        if (authUser) {
          setUser(authUser);
          setIsFetching(false);
          return;
        }
        setUser(null);
        setIsFetching(false);
      } catch (error) {
        console.error("Error in onAuthStateChanged:", error);
        setIsFetching(false); // Make sure to set fetching to false even if there's an error
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, isFetching };
}

function App() {
  const { user, isFetching } = useAuth();

  if (isFetching) {
    console.log("Is Fetching");
    return <LoadingScreen />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<ProtectedRoute user={user}><HomePage user={user} /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage user={user}/>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/MessageApp/:threadId" element={<MessageApp />} />
        <Route path="/ticket/:id" element={<TicketLoader />} />
        <Route path="/ticket/edit/:id" element={<EditTicket />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
