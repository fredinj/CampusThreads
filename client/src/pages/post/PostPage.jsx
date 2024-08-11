import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import MainPostCard from '../../components/post/MainPostCard'
import CommentCard from '../../components/post/CommentCard';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { AuthContext } from "../../contexts/AuthContext";

const PostPage = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([])
  const [post, setPost] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    content: ""
  });

  const { logout } = useContext(AuthContext)

  const handleLogout = async () => {
    try {
      await logout(); // Use the logout function from AuthContext
      navigate("/"); // Redirect to the home page or any other page
    } catch (error) {
      console.error("Logout failed", error);
      setError("Logout failed. Please try again.");
    }
  };

  const handleInputChange = (e, editor = false) => {
    if (editor) {
      setForm({ ...form, content: e });
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const formData = new FormData();
      // const safeContent = DOMPurify.sanitize(content);
      // formData.append("comment_content", form.comment_content);

      const comment_content = {
        comment_content: form.content
      }

      const response = await axios.post(
        `http://localhost:3000/api/comments/post/${post._id}`,
        comment_content,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true, // This ensures cookies are sent with the request
        }
      );


      if (response.status !== 201) {
        throw new Error("Network response was not ok, Status: ", response.status);
      }

      const { newComment } = response.data
      setComments([...comments, newComment]);
      setForm({ ...form, content: "" });

    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try{
        const response = await axios.get(`http://localhost:3000/api/comments/post/${postId}`, {
          withCredentials: true
        });
        setComments(response.data)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      } 
    }

    const fetchPost = async () => {
      try{
        const response = await axios.get(`http://localhost:3000/api/posts/${postId}`, {
          withCredentials: true
        });
        setPost(response.data)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      } 
    }
    
    fetchPost();
    fetchComments();
  }, []);

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return(
    <div className="flex flex-col items-center mt-4">

      <nav>
        <Link to="/"> 
          <button className="border border-black rounded px-2 py-1 ml-2">
            Home
          </button>
        </Link>
        <Link to="/profile/"> 
          <button className="border border-black rounded px-2 py-1 ml-2">
            Profile
          </button>
        </Link>
        <button className="border border-black rounded px-2 py-1 ml-2" onClick={handleLogout}>Logout</button>
      </nav>

      <MainPostCard 
        key={post._id}
        title={post.post_title} 
        content={post.post_content} 
        image_url={post.image_url}
        postId = {post._id}
      />

      <div className="flex flex-col items-center border border-black p-5 m-5">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full gap-2"
        >

          <div className="flex flex-col w-[25rem]">
            <label htmlFor="content">Comment:</label>
            <ReactQuill
              id="content"
              name="content"
              value={form.content}
              onChange={handleInputChange}
              required
            />
          </div>

          <button
            className="bg-blue-500 text-white font-bold py-1 px-1 rounded border border-blue-700 hover:bg-blue-700"
            type="submit"
          >
            Comment
          </button>
        </form>
      </div>

      {comments.map(comment => (
        <CommentCard 
          key={comment._id}
          author={comment.author}
          author_id={comment.author_id}
          comment_content={comment.comment_content}
        />
      ))}

    </div>
  )
}

export default PostPage;