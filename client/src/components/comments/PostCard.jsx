  import React from 'react';
  import './PostCard.css'; 
  import {Link} from 'react-router-dom';

  const PostCard = ({ title, content, image_url, postId }) => {

    const imageUrl = image_url ? `http://localhost:3000/images/${image_url}` : null;

    return (
      <div className="post-card">
        <h2 className="post-title">{title}</h2>
        <p className="post-content">{content}</p>
        {imageUrl && <img src={imageUrl} alt="Post image" />}
      </div>
    );
  };

  export default PostCard;
