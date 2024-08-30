import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

import ApproveRequest from './pages/request/ApproveRequests.jsx';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import PostPage from "./pages/post/PostPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import MakeRequest from "./pages/request/MakeRequest";
import UserProfile from "./pages/user-profile/UserProfile";
import CategoryFeed from "./pages/category-feed/CategoryFeed";

import Navbar from './components/navbar/Navbar.jsx';

function App() {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className='bg-zinc-100 w-full min-h-screen py-5'>
    <Navbar />
    <Routes>
      <Route path="/signup" element={<SignUp />} />

      {isAuthenticated ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/verify-email" element={<UserProfile />} /> 
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:categoryId" element={<CategoryFeed />} />
          <Route path="/profile" element={<UserProfile />} />
          {(user.role === "teacher" || user.role === "admin") && (
            <Route path="/categories/make-request" element={<MakeRequest />} />
          )}
          {user.role === 'admin' && <Route path="/approve-request" element={<ApproveRequest />} />}
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<UserProfile />} /> 
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
    </div>
  );
}

export default App;