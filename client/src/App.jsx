import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

import Home from './pages/home/Home';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import CategoriesPage from './pages/categories/CategoriesPage';
import MakeRequest from './pages/Request/MakeRequest'; // Ensure this path is correct


function App() {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoriesPage />} />
          {userRole === 'teacher' && <Route path="/make-request" element={<MakeRequest />} />}

          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/make-request" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
