import { useContext, useEffect } from 'react';
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
import UpdateCategory from './pages/categories/UpdateCategory'; // Import the component
import PostsByTag from './pages/post/PostsByTag.jsx';

import Navbar from './components/navbar/Navbar.jsx';

function App() {
  
  useEffect(() => {
    const getTokenFromParams = () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      if (token) {
        verifyEmail(token);
      }
    };

    getTokenFromParams();
  }, [location.search]); // Run when location.search changes

  useEffect(() => {
    document.title =  import.meta.env.VITE_APP_NAME 
    ? import.meta.env.VITE_APP_NAME 
    : 'CampusThreads'
  }, []);


  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className='bg-slate-800 w-full min-h-screen py-5'>
    <Navbar />
      <Routes>
        <Route path="/signup" element={<SignUp />} />

        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/verify-email" element={<UserProfile />} /> 
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/post/:postId" element={<PostPage />} />
            <Route path="/posts-by-tag/:tag" element={<PostsByTag />} />

            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:categoryId" element={<CategoryFeed />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/categories/:id/update" element={<UpdateCategory />} />
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