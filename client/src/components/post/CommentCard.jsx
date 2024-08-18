import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import DOMPurify from "dompurify";
import ReplyCard from "./ReplyCard";

const CommentCard = ({ commentProp })=>{

  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState({ ...commentProp });
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [isReplying, setIsReplying] = useState(false)
  const [reply, setReply] = useState("")
  const [commentEditContent, setCommentEditContent] = useState();
  const [error, setError] = useState(null);

  const handleSaveComment = (newComment) => {
    setComment({ ...newComment });
    setIsEditingComment(false);
  };

  const handleReplyComment = async ({ comment_content }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/comments/post/${comment.post}`,
        {
          comment_content: comment_content,
          parent_comment: comment._id
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        },
      );

      if (response.status !== 201) {
        throw new Error(
          "Network response was not ok, Status: ",
          response.status,
        );
      }

      const savedComment = response.data;
      setReply(savedComment);
      setIsReplying(false)
    } catch (error) {
      setError(error.message);
    }
  }

  const handleInputChange = (value) => {
    setCommentEditContent(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const comment_content = {
        comment_content: DOMPurify.sanitize(commentEditContent),
      };

      const response = await axios.put(
        `http://localhost:3000/api/comments/${comment._id}`,
        comment_content,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        },
      );

      if (response.status !== 200) {
        throw new Error(
          "Network response was not ok, Status: ",
          response.status,
        );
      }
      setCommentEditContent("");

      const newComment = response.data;
      handleSaveComment(newComment);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="m-5 border border-black p-3 rounded-lg">

      {!isEditingComment ? (
        <div>
        <Link to={`/user/${comment.author_id}`}>
          <h4 className="text-blue-500 hover:text-blue-700">
            {comment.author}
          </h4>
        </Link>
        <hr />
        <div
          className="prose my-1"
          dangerouslySetInnerHTML={{ __html: comment.comment_content }}
        />
      </div>
      ) : (
        <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-2 my-1"
        >
          <div className="flex w-[25rem] flex-col">
            <label htmlFor="content">Edit Comment:</label>
            <ReactQuill
              id="content"
              name="content"
              value={commentEditContent}
              onChange={handleInputChange}
              required
            />
          </div>

          <button
            className="rounded border border-blue-700 bg-blue-500 px-1 py-1 font-bold text-white hover:bg-blue-700"
            type="submit"
          >
            Save Comment
          </button>
        </form>
      )}

      <hr />

      { isReplying ? (
        <div> 

        </div>
      ) : (<></>)}

      <div className="mt-2">
        {comment.author_id === user._id && (
          <button
            className="rounded-lg border border-black pl-1 pr-1 "
            onClick={() => {
              setIsEditingComment(!isEditingComment)
              setCommentEditContent(comment.comment_content || "");
            }}
          >
            { !isEditingComment? "Edit" : "Cancel Edit"}
          </button>
        )}

        <button 
          className="rounded-lg border border-black pl-1 pr-1 ml-2"
          onClick={()=>{
            setIsReplying(!isReplying)
          }}
        > 
          { !isReplying? "Reply" : "Cancel Reply" }
        </button>
      </div>

      {isReplying ? (
        <ReplyCard onReply={handleReplyComment}/>
      ):(<></>)}
      
      {comment.child_comments.length > 0 ? (
        <div>
        {comment.child_comments.map((childComment) => (
          <CommentCard key={childComment._id} commentProp={childComment} />
        ))}
      </div>
      ) : (<></>)}

    </div>
  )

}


export default CommentCard