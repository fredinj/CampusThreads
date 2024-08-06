import React from 'react';
import {Link} from 'react-router-dom';

const PostCard = ({ title, content, image_url, postId }) => {

  const imageUrl = image_url ? `http://localhost:3000/images/${image_url}` : null;

  return (
    <div className="flex flex-col border border-black rounded-lg p-2 m-4 w-[25rem]">
      <Link to={`/posts/${postId}/`}>
        <h2 className="text-blue-500 hover:text-blue-700">{title}</h2>
      </Link>
      <p className="">{content}</p>
      {imageUrl && <img src={imageUrl} alt="Post image" />}
    </div>
  );
};

export default PostCard;
