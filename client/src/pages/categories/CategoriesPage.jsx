import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CategoriesPage.css"; // Import CSS file

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext); // Assuming AuthContext provides the token and userRole
  const navigate = useNavigate();

  const navigateToMakeRequest = () => {
    navigate("/categories/make-request/");
  };

  const navigateToApproveRequest = () => {
    navigate('/approve-request');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/category", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent with the request
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
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
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="categories-container">
      <div className="header">
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </button>
        <h1>Categories</h1>
        <div className="top-right-buttons">
          {(user.role === "teacher" || user.role === "admin") && (
            <button onClick={navigateToMakeRequest}>Make Request</button>
          )}
            {userRole === 'admin' && (
            <button onClick={navigateToApproveRequest}>View Requests</button>
          )}
        </div>
      </div>
      {categories.length > 0 ? (
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div
              key={category._id}
              className="category-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <button
                className="explore-button"
                onClick={() => {
                  navigate(`/category/${category._id}`);
                }}
              >
                Explore More
              </button>
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
