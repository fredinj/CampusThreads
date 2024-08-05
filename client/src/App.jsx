import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

import Home from './pages/home/Home'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import PostPage from './pages/post/PostPage'

// import './App.css'


function App() {
  const { isAuthenticated, isLoading } = useContext(AuthContext)

  if(isLoading) return <p>Loading...</p>

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/posts/:postId" element={<PostPage />} />
          <Route path="/categories" element={<Navigate to="/categories" />} /> 
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </>
      )}
    </Routes>
  );

}

export default App
