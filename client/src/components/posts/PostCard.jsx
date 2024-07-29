import React from 'react';
import './PostCard.css'; 

const PostCard = ({ title, content, image_url }) => {

  const imageUrl = image_url ? `http://localhost:3000/images/${image_url}` : null;

  return (
    <div className="post-card">
      <h2 className="post-title">{title}</h2>
      <p className="post-content">{content}</p>
      {imageUrl && <img src={imageUrl} alt="Post image" />}
      {/* {imageUrl && <p>{imageUrl}</p>} */}
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
