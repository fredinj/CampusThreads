import React from 'react';
import {Link} from 'react-router-dom';

const MainPostCard = ({ title, content, image_url, postId }) => {

  const imageUrl = image_url ? `http://localhost:3000/images/${image_url}` : null;

  return (
    <div className="border border-black rounded-lg flex flex-col m-5 p-2 w-[25rem]">
      <Link to={`/posts/${postId}/`}>
        <h2 className="font-bold">{title}</h2>
      </Link>
      <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
      {imageUrl && <img src={imageUrl} alt="Post image" />}
    </div>
  );
};

export default MainPostCard;
