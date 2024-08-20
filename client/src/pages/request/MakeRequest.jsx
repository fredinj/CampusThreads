import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MakeRequest.css"; // Import CSS file

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const MakeRequest = () => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  // const { token } = useContext(AuthContext); // Assuming AuthContext provides the token // auth context isn't providing the token
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    try {
      const response = await axios.post(
        "http://localhost:3000/api/category/request",
        {
          categoryName,
          description,
          tags: tags.split(",").map((tag) => tag.trim()), // Convert tags from comma-separated string to array
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // Authorization: `Bearer ${token}`, // Ensure token is included // We're keeping the token in the cookie
          },
          withCredentials: true, // Ensure cookies are included
        },
      );
      if (response.status === 201) {
        navigate("/categories"); // Navigate on success
      }
    } catch (error) {
      // Log detailed error for debugging
      console.error(
        "Submission error:",
        error.response ? error.response.data : error.message,
      );
      setError("Failed to submit request. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="make-request-container">
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </button>
      <button
        onClick={() => {
          navigate("/categories");
        }}
      >
        Categories
      </button>
      <h1>Make a Request</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Category Name:
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
          />
        </label>
        <label>
          Tags (comma-separated):
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default MakeRequest;
