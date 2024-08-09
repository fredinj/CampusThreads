import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

import Home from './pages/home/Home'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import PostPage from './pages/post/PostPage'

function App() {
  const { isAuthenticated, isLoading } = useContext(AuthContext)

  if(isLoading) return <p>Loading...</p>

  return (
    <Routes>
      {/* <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} /> */}

      <Route path="/signup" element={<SignUp />} />

      {isAuthenticated ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/post/:postId" element={<PostPage />} />
          {/* <Route path="/user/:userId" element={<Navigate to="/user/:userId" />} /> pass it to the component */}
          {/* <Route path="/categories" element={<Navigate to="/categories" />} />  */}
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
        </>
      )}
    </Routes>
  );

}

export default App
