import React from "react";

const CommentCard = ({ author, content }) => {
  return (
    <div className="comment-card">
      <h4 className="comment-author">{author}</h4>
      <p className="comment-content">{content}</p>
    </div>
  );
};

export default CommentCard;