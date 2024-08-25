import React from "react";

import RichTextEditor from "../../components/editorjs/RichTextEditor";

const editorData = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "paragraph",
      data: {
        text: "",
      },
    },
  ],
};

const CategoryFeedTest = () => {

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

  return (

    <div className="post-editor-form max-w-[80%]">
      <RichTextEditor INITIAL_DATA_PROP={editorData} onSave={handlePostSubmit}/>
    </div>

  );
};

export default CategoryFeedTest;