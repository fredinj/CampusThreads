import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './CategoriesPage.css'; // Import CSS file

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext); // Assuming AuthContext provides the token

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/category', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are sent with the request
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="categories-container">
      <h1>Categories</h1>
      {categories.length > 0 ? (
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={category._id} className="category-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <button className="explore-button">Explore More</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No categories found.</p>
      )}
    </div>
  );
};

export default CategoriesPage;
