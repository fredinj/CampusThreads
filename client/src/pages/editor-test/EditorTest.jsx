import React, { useState } from "react";
import Editor from "./EditorComponent";
import DisplayContent from "./DisplayComponent.jsx";

// const INITIAL_DATA = {
//   time: new Date().getTime(),
//   blocks: [
//     {
//       type: "paragraph",
//       data: {
//         text: "",
//         level: 1,
//       },
//     },
//   ],
// };

const INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [],
};

const EditorTest = () => {
  // const [data, setData] = useState(INITIAL_DATA);
  const [data, setData] = useState(INITIAL_DATA);

  return (
    // <div className="editor">
    <div className="editor prose sm:mx-[60px] sm:max-w-[calc(100%-120px)]">
      <Editor data={data} onChange={setData} editorblock="editorjs-container" />
      <button
        className="border border-black p-1"
        onClick={() => {
          // alert(JSON.stringify(data));
          console.log(data);
        }}
      >
        Save
      </button>
      {data.blocks.length > 0 && (
        <div className="m-2 rounded rounded-lg border border-gray-600 p-2">
          <DisplayContent data={data} />
        </div>
      )}
    </div>
  );
};

export default EditorTest;
