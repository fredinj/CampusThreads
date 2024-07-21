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

// const PostCard = () => {
//   return(
//     <div className="post-card">
//       <h2 className="post-title">Title</h2>
//       <p className="post-content">Content</p>
//     </div>
//   )
// }

export default PostCard;
