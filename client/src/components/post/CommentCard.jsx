import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import CommentEditCard from "./CommentEditCard";

const CommentCard = ({ commentProp }) => {
  const { user } = useContext(AuthContext);
  const [isEditingComment, setisEditingComment] = useState(false);
  const [comment, setComment] = useState({ ...commentProp });

  const handleSaveComment = (newComment) => {
    setComment({ ...newComment });
    setisEditingComment(false);
  };

  return (
    <div className="m-2 flex flex-col items-start rounded-lg border border-black px-5 py-2">
      {!isEditingComment ? (
        <>
          <Link to={`/user/${comment.author_id}`}>
            <h4 className="text-blue-500 hover:text-blue-700">
              {comment.author}
            </h4>
          </Link>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: comment.comment_content }}
          />
        </>
      ) : (
        <CommentEditCard comment={comment} onSave={handleSaveComment} />
      )}

      {comment.author_id === user._id && (
        <button
          className="rounded-lg border border-black p-2"
          onClick={() => setisEditingComment(!isEditingComment)}
        >
          {isEditingComment ? "Cancel Edit" : "Edit Comment"}
        </button>
      )}
    </div>
  );
};

export default CommentCard;
