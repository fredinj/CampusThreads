import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import MainPostCard from '../../components/post/MainPostCard'
import CommentCard from '../../components/post/CommentCard';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { AuthContext } from "../../contexts/AuthContext";
import PostEditor from "../../components/post/PostEditor";
import DOMPurify from "dompurify";

const PostPage = () => {
  const { postId } = useParams();
  const [comments, setCommentsList] = useState([])
  const [post, setPost] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [comment, setComment] = useState({
    content: ""
  });


  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)
  const { user } = useContext(AuthContext)

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      setError("Logout failed. Please try again.");
    }
  };

  const handleInputChange = (e) => {
      setComment({ ...comment, content: e });
  };

  const handleSavePost = (newPost) => {
    setPost({ ...newPost }); 
    setIsEditingPost(false); //toggled with buttons anyways
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const comment_content = {
        comment_content: DOMPurify.sanitize(comment.content)
      }

      const response = await axios.post(
        `http://localhost:3000/api/comments/post/${post._id}`,
        comment_content,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );


      if (response.status !== 201) {
        throw new Error("Network response was not ok, Status: ", response.status);
      }

      const { newComment } = response.data
      setCommentsList([...comments, newComment]);
      setComment({ ...comment, content: "" });

    } catch (error) {
      setError(error.message);
    }
  };

  const fetchComments = async () => {
    try{
      const response = await axios.get(`http://localhost:3000/api/comments/post/${postId}`, {
        withCredentials: true
      });
      setCommentsList(response.data)
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

  useEffect(() => {
   
    fetchPost();
    fetchComments();

  }, [postId]);

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return(
    <div className="flex flex-col items-center mt-4">

      <nav>
        <button className="border border-black rounded px-2 py-1 ml-2"
          onClick={ () => {navigate("/")} }>
          Home
        </button>
        <button className="border border-black rounded px-2 py-1 ml-2"
          onClick={ () => {navigate(`/category/${post.category_id}`)} }>
          Category
        </button>
        <button className="border border-black rounded px-2 py-1 ml-2"
          onClick={ () => {navigate(`/profile`)} }>
          Profile
        </button>
        <button className="border border-black rounded px-2 py-1 ml-2" onClick={handleLogout}>Logout</button>
      </nav>

      { isEditingPost ? (
        <PostEditor post = {post} onSave={handleSavePost} />
      ) : (
        <MainPostCard key={post._id} post={post} /> 
      )

      }

      { post.author_id === user._id && <div className="post-toolbar">
        <button
          className="border border-black rounded-lg p-2"
          onClick={ ()=> setIsEditingPost(!isEditingPost) }
        > 
          {isEditingPost ? 'Cancel Edit' : 'Edit Post'} 
        </button>
      </div>}

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
              value={comment.content}
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
          commentProp={comment}
        />
      ))}

    </div>
  )
}

export default PostPage;