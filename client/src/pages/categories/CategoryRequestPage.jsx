import React, { useState } from "react";
import axios from "axios";
import "./CategoryRequestPage.css";

function CategoryRequestPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/categories/request", {
        categoryName: name,
        description: description,
        tags: tags.split(",").map((tag) => tag.trim()), // Split tags into an array
        requestedBy: "user-id", // replace with actual user id
      })
      .then((response) => {
        alert("Category request submitted!");
        setName("");
        setDescription("");
        setTags("");
      })
      .catch((error) => {
        console.error(
          "There was an error submitting the category request!",
          error,
        );
      });
  };

  return (
    <div className="category-request-container">
      <h1>Request a New Category</h1>
      <form className="category-request-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Tags (comma separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default CategoryRequestPage;
