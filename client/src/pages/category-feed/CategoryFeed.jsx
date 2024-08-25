import React, { useRef, useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import RichTextEditor from "../../components/editorjs/RichTextEditor";
import PostCard from "../../components/post/PostCard";

const editorInitData = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "paragraph",
      data: {
        text: "",
      },
    },
  ],
}

const CategoryFeed = () => {
  const [editorData, setEditorData] = useState({...editorInitData})
  const [postTitle, setPostTitle] = useState("")
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [fetchedPostsCount, setFetchedPostsCount] = useState(0);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [postsData, setPostsData] = useState({
    posts:[],
    hasMorePosts: false
  });

  const { categoryId } = useParams();

  const { logout, user, reloadUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Use the logout function from AuthContext
      navigate("/"); // Redirect to the home page or any other page
    } catch (error) {
      console.error("Logout failed", error);
      setError("Logout failed. Please try again.");
    }
  };

  const handleSubscribe = async () => {
    const subscriptionStatus = user.categories.includes(categoryId)

    const requestURL = subscriptionStatus ? `http://localhost:3000/api/user/category/${categoryId}/unsubscribe` : `http://localhost:3000/api/user/category/${categoryId}/subscribe`

    try{
      const response = await axios.put(
        requestURL,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        },
      )


    } catch (error) {
      setError(error.message)
    } finally {
      reloadUserData()
    }
  }

  const handlePostSubmit = async (dataFromEditor) => {
    try {
      const postData = {
        "post_title": postTitle,
        "post_content": dataFromEditor,
        "category_id": categoryId
      }
      const response = await axios.post(
        "http://localhost:3000/api/posts",
        postData,
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
          "Network response was not ok, Status: " + response.status,
        );
      }
      setPostTitle("")
      setEditorData({...editorInitData})

      const newPostsData = {
        ...postsData,
        posts: [response.data, ...postsData.posts]
      }

      setPostsData(newPostsData)
      setIsPosting(false)

    } catch (error) {
      setError(error.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/posts/category/${categoryId}?postLimit=3&postSkip=${fetchedPostsCount}`,
        {
          withCredentials: true, // Ensure cookies are sent with the request
        },
      );

      const newPostsData = {
        ...response.data,
        posts: [...postsData.posts, ...response.data.posts]
      }

      setPostsData(newPostsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(()=> {
    if (postsData.posts){
      setFetchedPostsCount(postsData.posts.length)
      setTotalPostsCount(postsData.posts.totalPosts)
    }
  }, [postsData])

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="my-4 flex flex-col items-center">

      <nav>
        <button
          className="ml-2 rounded border border-black px-2 py-1"
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </button>
        <button
          className="ml-2 rounded border border-black px-2 py-1"
          onClick={() => {
            navigate("/categories");
          }}
        >
          Categories
        </button>
        <button
          className="ml-2 rounded border border-black px-2 py-1"
          onClick={() => {
            navigate("/profile/");
          }}
        >
          Profile
        </button>
        <button
          className="ml-2 rounded border border-black px-2 py-1"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      <div className="my-3">
        <button
          className="border border-black p-2 rounded"
          onClick={handleSubscribe}
        >
          {user.categories.includes(categoryId)? "Unsubscribe" : "Subscribe"}
        </button>
      </div>

      {isPosting? (
        <div className="post-editor-form max-w-[80%] p-5 flex flex-col items-center">
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-[calc(80%)] p-2 mb-4 border border-gray-300 rounded"
          />
          <RichTextEditor INITIAL_DATA_PROP={editorData} onSave={handlePostSubmit}/>
        </div>
      ) : (
        <></>
      )}

      <div>
        <button 
          className="rounded-lg border border-black px-1"
          onClick={ ()=> setIsPosting(!isPosting) }
        >
          {isPosting ? "Cancel Post" : "Make Post"}
        </button>
      </div>

      <div className="m-5 flex flex-col border p-5">
        {postsData.posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      {postsData.hasMorePosts ? (
        <button
          className="rounded-lg border border-black px-1"
          onClick={()=> {
            fetchPosts()
          }}
        >
          Load More
        </button>
      ):(<></>)}
    </div>
  );
};

export default CategoryFeed;