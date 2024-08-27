import React, { useRef, useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import RichTextDisplay from "../../components/editorjs/RichTextDisplay"
import RichTextEditor from "../editorjs/RichTextEditor";

const MainPostCard = ({ postProp }) => {
  const [post, setPost] = useState({ ...postProp })
  const [postTitle, setPostTitle] = useState(postProp.post_title || "")
  const { user } = useContext(AuthContext)
  const [error, setError] = useState(null);

  const [isEditingPost, setIsEditingPost] = useState(false);

  const handleSavePost = (newPost) => {
    setPost({ ...newPost });
    // setPostTitle("")
    setIsEditingPost(false); //toggled with buttons anyways
  };

  const handlePostDelete = async ()=> {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/posts/${post._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true, // This ensures cookies are sent with the request
        },
      );

      setPost(response.data.post)
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(()=>{
    console.log(post.post_content)
  }, [post])

  const handlePostEdit = async (dataFromEditor) => {
    const postData = {
      "post_title": postTitle,
      "post_content": dataFromEditor,
      "category_id": post.category_id
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/posts/${post._id}`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true, // This ensures cookies are sent with the request
        },
      );

      if (response.status !== 200) {
        throw new Error(
          "Network response was not ok, Status: ",
          response.status,
        );
      }

      const newPost = response.data;

      handleSavePost(newPost);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) return <p>Error: {error}</p>;

  
  return(
    <div>
      {!isEditingPost ? (    
        <div className="m-5 flex flex-col rounded-lg border border-black p-2 min-w-[60vw]">
          <Link to={`/user/${post.author_id}`}>
            <h3 className="text-blue-500 hover:text-blue-700">{post.author}</h3>
          </Link>

          <h2 className="font-bold">{post.post_title}</h2>

          {/* <RichTextDisplay data={post.post_content} /> */}
          <RichTextEditor key={JSON.stringify(post.post_content)} INITIAL_DATA_PROP={post.post_content} onSave={handlePostEdit} readOnly={true} isEditingPost={isEditingPost}/>

        </div> ) : (

        <div className="m-5 mt-4 flex flex-col rounded-lg items-center border border-black p-2 min-w-[60vw]">
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-[calc(80%)] p-2 mb-4 border border-gray-300 rounded"
          />

        <RichTextEditor INITIAL_DATA_PROP={post.post_content} onSave={handlePostEdit} buttonText="Save Post"/>
        </div>

      )}

      {post.author_id === user._id && !post.is_deleted && (
          <div className="post-toolbar items-center flex flex-col mt-2">
            <button
              className="rounded-lg border border-black p-2"
              onClick={() => setIsEditingPost(!isEditingPost)}
            >
              {!isEditingPost ? "Edit Post" : "Cancel Edit"}
            </button>
          </div>
      )}

      {post.author_id === user._id && !post.is_deleted && (
          <div className="post-toolbar items-center flex flex-col mt-2">
            <button
              className="rounded-lg border border-black p-2"
              onClick={handlePostDelete}
            >
              Delete Post
            </button>
          </div>
      )}
    </div>
  )
};

export default MainPostCard;
