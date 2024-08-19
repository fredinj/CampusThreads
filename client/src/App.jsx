import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import PostPage from "./pages/post/PostPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import MakeRequest from "./pages/request/MakeRequest";
import CategoryFeed from "./pages/category-feed/CategoryFeed";
import EditorTest from "./pages/editor-test/EditorTest";
import EditorTest2 from "./pages/editor-test2/EditorTest2";

function App() {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  if (isLoading) return <p>Loading...</p>;

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
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:categoryId" element={<CategoryFeed />} />
          {(user.role === "teacher" || user.role === "admin") && (
            <Route path="/categories/make-request" element={<MakeRequest />} />
          )}
          {/* <Route path="/user/:userId" element={<Navigate to="/user/:userId" />} /> pass it to the component */}
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

  // return(<EditorTest2 />)
  // return(<TiptapEditor />)
}

export default App;
