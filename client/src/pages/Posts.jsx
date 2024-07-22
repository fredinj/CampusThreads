/* Old Stuff
import React, { useEffect, useState } from 'react';
import './Posts.css';
import PostCard from '../components/PostCard';

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/posts')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div id="main-container">
      <div id="posts-container">
        {posts.map((post) => (
          <PostCard key={post.post_id} title={post.post_title} content={post.post_content} />
        ))}
      </div>
    </div>
  );
}

export default Posts;

*/

import React, { useEffect, useState } from 'react';
import './Posts.css';
import PostCard from '../components/PostCard'; // Import the PostCard component

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to handle form inputs
  const [form, setForm] = useState({
    id: '',
    title: '',
    content: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          post_id: form.id,
          post_title: form.title,
          post_content: form.content
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const newPost = await response.json();
      setPosts([...posts, newPost]);
      setForm({ id: '', title: '', content: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/posts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPosts(data); 
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
    <div className="main-container">
      <div className="top-content">
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="id">ID:</label>
            <input
              type="text"
              id="id"
              name="id"
              value={form.id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Add Post</button>
        </form>
      </div>
      <div className="posts-container">
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


