import React, { useState } from "react";
import Editor from "./EditorComponent";

const INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "paragraph",
      data: {
        text: "",
        level: 2,
      },
    },
  ],
};

const PostEditorJs = () => {
  const [data, setData] = useState(INITIAL_DATA);
  
  return (
    <div className="w-full flex flex-col items-center border border-black">
      
      <div className="prose w-full max-w-[75%]">
        <Editor 
          data={data} 
          readOnly={false} 
          onChange={setData} 
          editorblock="editorjs-container" 
        />
      </div>

      <button
        className="border border-black p-1"
        onClick={() => {
          // alert(JSON.stringify(data));
          console.log(data);  
        }}
      >
        Save
      </button>

    </div>
  );
};

export default PostEditorJs;
