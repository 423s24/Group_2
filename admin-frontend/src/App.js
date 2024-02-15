import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/login';
import HomePage from './Pages/home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
