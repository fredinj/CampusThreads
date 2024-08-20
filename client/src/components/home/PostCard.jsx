import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  const imageUrl = post.image_url
    ? `http://localhost:3000/images/${post.image_url}`
    : null;

  return (
    <div className="m-4 flex w-[25rem] flex-col rounded-lg border border-black p-2">
      <Link to={`/user/${post.author_id}`}>
        <h3 className="text-blue-500 hover:text-blue-700">Author</h3>
      </Link>

      <Link to={`/post/${post._id}/`}>
        <h2 className="text-blue-500 hover:text-blue-700">{post.post_title}</h2>
      </Link>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.post_content }}
      />
      {imageUrl && <img src={imageUrl} alt="Post image" />}
    </div>
  );
};

export default PostCard;
