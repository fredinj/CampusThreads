import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import ReactQuill from "react-quill-new";
// import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "react-quill/dist/quill.core.css"; // Import Quill styles
import "react-quill/dist/quill.bubble.css"; // Import Quill styles
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
  const [loading, setLoading] = useState(true);
  const [childCount, setChildCount] = useState(0)
  const [fetchedChildCount, setFetchedChildCount] = useState(0)

  const handleSaveComment = (newComment) => {
    setComment({ ...newComment });
    setIsEditingComment(false);
  };

  const handleInputChange = (value) => {
    setCommentEditContent(value);
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

      setReply(response.data)
      setIsReplying(false)

      const commentWithReply = {
        ...comment,
        child_comments: [...comment.child_comments, response.data],
      };

      setComment(commentWithReply)

    } catch (error) {
      setError(error.message);
    }
  }

  const handleLoadMore = async ()=> {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/comments/post/${comment.post}?topLevelLimit=2&childLimit=2&depth=2&parentCommentId=${comment._id}&topLevelSkip=${fetchedChildCount}`,
        {
          withCredentials: true,
        },
      );

      // console.log(response.data)
      // console.log(response.data.hasMoreComments)

      const newList = {
        ...comment,
        child_comments: [...comment.child_comments, ...response.data.comments],
        hasMoreComments: response.data.hasMoreComments
      };

      // console.log(newList)
      setComment(newList)

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCommentEdit = async (e) => {
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

      // const newComment = response.data;
      const newComment = {...comment, ...comment_content }
      // console.log(newComment)
      handleSaveComment(newComment);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteComment = async () => {
    
    const response = await axios.delete(
      `http://localhost:3000/api/comments/${comment._id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      },
    );

    const deletedComment = {
      ...comment,
      comment_content: response.data.comment.comment_content,
      author: response.data.comment.author,
      author_id: response.data.comment.author_id,
      is_deleted: response.data.comment.is_deleted
    }

    setComment(deletedComment)
  }

  useEffect(()=> {
    setChildCount(comment.totalChildComments)
    setFetchedChildCount(comment.child_comments.length)
  }, [comment])

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
        onSubmit={handleCommentEdit}
        className="flex w-full flex-col items-center gap-2 my-1"
        >
          <div className="flex w-[25rem] flex-col">
            <label htmlFor="content">Edit Comment:</label>
            <ReactQuill
              theme="bubble"
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

        { (!comment.is_deleted && comment.author_id === user._id) ? (<button 
          className="rounded-lg border border-black pl-1 pr-1 ml-2"
          onClick={()=>{
            handleDeleteComment()
          }}
        > 
          Delete
        </button>) : (<></>)}
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

      {comment.hasMoreComments ? (
        <button
          className="rounded-lg border border-black pl-1 pr-1"
          onClick={()=> {
            handleLoadMore()
          }}
        >
          Load More
        </button>
      ):(<></>)}

    </div>
  )

}


export default CommentCard