import React, { useRef, useEffect, useState, useContext } from 'react';
import './Home.css';
import PostCard from '../../components/posts/PostCard'; // Import the PostCard component
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to handle form inputs
  const [form, setForm] = useState({
    title: '',
    content: ''
  });
  
  // Create a ref for the file input
  const fileInputRef = useRef(null);

  // using auth context
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();


  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle image file upload
  const handleImageUpload = (e) => {
    const {name} = e.target;
    const image = e.target.files[0]
    if(image){
      setForm({...form, [name]: image})
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('post_title', form.title)
      formData.append('post_content', form.content)
      if(form.image){
        formData.append('image', form.image)
      }

      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const newPost = await response.json();
      setPosts([...posts, newPost]);
      setForm({ title: '', content: '' });
      fileInputRef.current.value = null; 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
        await logout(); // Use the login function from AuthContext
        navigate('/'); // Redirect to the home page or any other page
    } catch (error) {
      console.error('Logout failed', error);
      setError('Logout failed. Please try again.');
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

    <nav>
      <button onClick={handleLogout}>Logout</button>
    </nav>

      <div className="top-content">
        <form onSubmit={handleSubmit} className="post-form">
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
          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
          <button type="submit">Add Post</button>
        </form>
      </div>
      <div className="posts-container">
        {posts.map(post => (
          <PostCard 
            key={post._id}
            title={post.post_title} 
            content={post.post_content} 
            image_url={post.image_url}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;


