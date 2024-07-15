import React from 'react';
import './PostCard.css'; // Import the CSS file

const PostCard = ({ title, content }) => {
  return (
    <div className="post-card">
      <h2 className="post-title">{title}</h2>
      <p className="post-content">{content}</p>
    </div>
  );
};

export default PostCard;
