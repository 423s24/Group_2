import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
