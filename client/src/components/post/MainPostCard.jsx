import React from 'react';
import {Link} from 'react-router-dom';

const MainPostCard = ({ post }) => {

  const imageUrl = post.image_url ? `http://localhost:3000/images/${post.image_url}` : null;

  return (
    <div className="border border-black rounded-lg flex flex-col m-5 p-2 w-[25rem]">
      <Link to={`/user/${post.author_id}`}>
        <h3 className="text-blue-500 hover:text-blue-700">Author</h3>
      </Link>
      <h2 className="font-bold">{post.post_title}</h2>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.post_content }} />
      {imageUrl && <img src={imageUrl} alt="Post image" />}
    </div>
  );
};

export default MainPostCard;