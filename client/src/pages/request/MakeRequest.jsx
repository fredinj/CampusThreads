import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import './MakeRequest.css'; // Import CSS file

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
        }
      );
      if (response.status === 201) {
        navigate("/"); // Navigate on success
      }
    } catch (error) {
      // Log detailed error for debugging
      console.error(
        "Submission error:",
        error.response ? error.response.data : error.message
      );
      setError("Failed to submit request. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="make-request-container bg-gray-900 text-gray-300 font-sans flex flex-col items-center p-[1.25rem]">
      <h1 className="mb-[1.25rem]">Make a Request</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-[600px]">
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
            className="w-full h-[150px] p-[0.625rem] mb-[1.25rem] border border-gray-300 rounded"
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
        <button
          type="submit"
          disabled={loading}
          className="py-[0.625rem] px-[1.25rem] bg-blue-500 text-white border-none rounded cursor-pointer"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {error && <p className="error text-red-500 mt-[0.625rem]">{error}</p>}
      </form>
    </div>
  );
};

export default MakeRequest;
