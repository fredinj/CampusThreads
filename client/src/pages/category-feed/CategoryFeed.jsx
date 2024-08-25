import React, { useRef, useEffect, useState, useContext } from "react";
import PostCard from "../../components/home/PostCard"; // Import the PostCard component
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import DOMPurify from "dompurify";
// import PostEditorJs from "../../components/editorjs/PostEditorJs";

const CategoryFeed = () => {
  const [postsData, setPostsData] = useState({
    posts:[],
    hasMorePosts: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedPostsCount, setFetchedPostsCount] = useState(0);
  const [totalPostsCount, setTotalPostsCount] = useState(0);

  const { categoryId } = useParams();

  // State to handle form inputs
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
  });

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  // using auth context
  const { logout, user, reloadUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle all form input changes including ReactQuill content
  const handleInputChange = (e, editor = false) => {
    const { name, value } = e.target || {};

    if (editor) {
      setForm({ ...form, content: e });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle image file upload
  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    if (image) {
      setForm({ ...form, image });
    }
  };

  // Handle form submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("post_title", DOMPurify.sanitize(form.title));
      formData.append("post_content", DOMPurify.sanitize(form.content));
      formData.append("category_id", categoryId);
      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await axios.post(
        "http://localhost:3000/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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

      const newPostsData = {
        ...response.data,
        posts: [response.data, ...postsData.posts]
      }

      setPostsData(newPostsData);
      setForm({ title: "", content: "", image: null });
      fileInputRef.current.value = null;
    } catch (error) {
      setError(error.message);
    }
  };

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

      console.log(response)

    } catch (error) {
      setError(error.message)
    } finally {
      reloadUserData()
    }
  }

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

  if (loading) return <p>Loading...</p>;
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

      {/* <div className="m-5 flex flex-col items-center border border-black p-5">
        <form
          onSubmit={handlePostSubmit}
          className="flex w-full flex-col items-center gap-2"
        >
          <div className="flex w-[25rem] flex-col">
            <label htmlFor="title">Title:</label>
            <input
              className="rounded border border-black p-1"
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex w-[25rem] flex-col">
            <label htmlFor="content">Content:</label>
            <ReactQuill
              id="content"
              name="content"
              value={form.content}
              onChange={(value) => handleInputChange(value, true)}
              required
            />
          </div>

          <div className="flex w-[25rem] flex-col">
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>

          <button
            className="rounded border border-blue-700 bg-blue-500 px-1 py-1 font-bold text-white hover:bg-blue-700"
            type="submit"
          >
            Add Post
          </button>
        </form>
      </div> */}

      <PostEditorJs />

      <div className="m-5 flex flex-col border p-5">
        {postsData.posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {postsData.hasMorePosts ? (
        <button
          className="rounded-lg border border-black pl-1 pr-1"
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
