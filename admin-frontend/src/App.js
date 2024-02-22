import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Javascript/login';
import HomePage from './Pages/Javascript/home';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Backend/Firebase';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from './Backend/ProtectedRoute';
import RegisterPage from './Pages/Javascript/register';
import ForgotPassword from './Pages/Javascript/forgotPassword';

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
    <BrowserRouter>
      <Routes>
        <Route index element={<ProtectedRoute user={user}><HomePage user={user} /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage user={user}/>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
