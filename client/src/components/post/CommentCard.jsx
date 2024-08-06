import React from "react";

const CommentCard = ({ author, content }) => {
  return (
    <div className="flex flex-col items-start border border-black px-5 py-2 m-2 rounded-lg">
      <h4>{author}</h4>
      <p>{content}</p>
    </div>
  );
};

export default CommentCard;