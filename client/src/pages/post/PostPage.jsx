import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import MainPostCard from '../../components/post/MainPostCard'
import CommentCard from '../../components/post/CommentCard';

const PostPage = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([])
  const [post, setPost] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate();

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
    <div className="flex flex-col items-center">

      <MainPostCard 
        key={post._id}
        title={post.post_title} 
        content={post.post_content} 
        image_url={post.image_url}
        postId = {post._id}
      />

      {comments.map(comment => (
        <CommentCard 
          key={comment._id}
          author={comment.author}
          content={comment.content}
        />
      ))}

    </div>
  )
}

export default PostPage;