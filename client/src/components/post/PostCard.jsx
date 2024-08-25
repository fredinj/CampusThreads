import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {

  return (
    <div className="m-4 flex w-[25rem] flex-col rounded-lg border border-black p-2">
      <Link to={`/user/${post.author_id}`}>
        <h3 className="text-blue-400 hover:text-blue-700">Author</h3>
      </Link>

      <Link to={`/post/${post._id}/`}>
        <h2 className="text-blue-950 hover:text-blue-700">{post.post_title}</h2>
      </Link>

    </div>
  );
};

export default PostCard;