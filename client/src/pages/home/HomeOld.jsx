import React, { useEffect, useState } from 'react';
import './Posts.css';
import PostCard from '../components/PostCard'; // Import the PostCard component

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/posts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPosts(data); // Assuming the API returns an array of posts
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div id="main-container">
      <div id="posts-container">
        {posts.map(post => (
          <PostCard 
            key={post.post_id} 
            title={post.post_title} 
            content={post.post_content} 
          />
        ))}
      </div>
    </div>
  );
};

export default Posts;
