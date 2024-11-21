import React, { useRef, useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axiosConfig";
import RichTextEditor from "../../components/editorjs/RichTextEditor";
import PostCard from "../../components/post/PostCard";
import Navbar from "../../components/navbar/Navbar";
import Button from "@mui/material/Button";
import LoadingIndicator from "../../components/ui/LoadingIndicator";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

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
  const [editorData, setEditorData] = useState({ ...editorInitData });
  const [postTitle, setPostTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [fetchedPostsCount, setFetchedPostsCount] = useState(0);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [postsData, setPostsData] = useState({
    posts: [],
    hasMorePosts: false
  });
  const [category, setCategory] = useState();

  const { categoryId } = useParams();
  const { logout, user, reloadUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      setError("Logout failed. Please try again.");
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `/api/category/${categoryId}`,
        {
          withCredentials: true,
        }
      );
      setCategory(response.data);
      setTags(response.data.tags || []); // Set tags from the category
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubscribe = async () => {
    const subscriptionStatus = user.categories.includes(categoryId);
    const requestURL = subscriptionStatus
      ? `/api/user/category/${categoryId}/unsubscribe`
      : `/api/user/category/${categoryId}/subscribe`;

    try {
      const response = await axios.put(
        requestURL,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      setError(error.message);
    } finally {
      reloadUserData();
    }
  }

  const handlePostSubmit = async (dataFromEditor) => {
    try {
      const postData = {
        post_title: postTitle,
        post_content: dataFromEditor,
        category_id: categoryId,
        tag: selectedTag // Include the selected tag
      };
      const response = await axios.post(
        "/api/posts",
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok, Status: " + response.status);
      }
      setPostTitle("");
      setSelectedTag(""); // Clear selected tag
      setEditorData({ ...editorInitData });

      const newPostsData = {
        ...postsData,
        posts: [response.data, ...postsData.posts]
      };

      setPostsData(newPostsData);
      setIsPosting(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `/api/posts/category/${categoryId}?postLimit=3&postSkip=${fetchedPostsCount}&userId=${user._id}`,
        {
          withCredentials: true,
        }
      );

      const newPostsData = {
        ...response.data,
        posts: [...postsData.posts, ...response.data.posts]
      };

      setPostsData(newPostsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategory();
  }, []);

  useEffect(() => {
    if (postsData.posts) {
      setFetchedPostsCount(postsData.posts.length);
      setTotalPostsCount(postsData.posts.totalPosts);
    }
  }, [postsData]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full min-h-full p-5">
      {/* <Navbar home={true} /> */}

      {loadingPosts ? (
        <div className="flex flex-col items-center justify-center w-full"><LoadingIndicator /></div>
      ) : (
        <div className="flex flex-col items-center w-full mx-auto my-10">
          {/* Subscribe/Unsubscribe Button */}
          <Button
            variant="contained"
            color="info"
            onClick={handleSubscribe}
            sx={{ mb: 3 }}
          >
            {user.categories.includes(categoryId) ? "Unsubscribe" : "Subscribe"}
          </Button>

          {/* Post Editor */}
          {isPosting && (
            <div className="post-editor-form w-full max-w-5xl p-5 flex flex-col items-center bg-white shadow-md rounded-lg">
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Enter post title"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <FormControl sx={{ mt: 2, minWidth:'10rem', maxWidth: '20rem' }}>
                <InputLabel>Tag</InputLabel>
                <Select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  label="Tag"
                >
                  {tags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <RichTextEditor
                INITIAL_DATA_PROP={editorData}
                onSave={handlePostSubmit}
              />
            </div>
          )}

          {/* Make Post Button */}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setIsPosting(!isPosting)}
            sx={{ mt: 2 }}
          >
            {isPosting ? "Cancel Post" : "Make Post"}
          </Button>

          {/* Posts Display */}
          <div className="mt-5 flex flex-col items-center w-full">
            {postsData.posts.map((post) => (
              <PostCard key={post._id} postProp={post} />
            ))}
          </div>

          {/* Load More Button */}
          {postsData.hasMorePosts && (
            <Button
              variant="contained"
              color="info"
              onClick={() => fetchPosts()}
              sx={{ my: 4, color: '#ffffff' }}
            >
              Load More
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFeed;