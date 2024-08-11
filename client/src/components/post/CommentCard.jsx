import React from "react";
import { Link } from "react-router-dom"

const CommentCard = ({ author, author_id, comment_content }) => {
  return (
    <div className="flex flex-col items-start border border-black px-5 py-2 m-2 rounded-lg">
      <Link to={`/user/${author_id}`} >
        <h4 className="text-blue-500 hover:text-blue-700">{author}</h4>
      </Link>
      <div className="prose" dangerouslySetInnerHTML={{ __html: comment_content }} />
    </div>
  );
};

export default CommentCard;