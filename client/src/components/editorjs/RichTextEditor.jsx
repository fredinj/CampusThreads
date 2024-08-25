import React, { useState } from "react";
import Editor from "./EditorComponent";
import './editorjs.css'

// const INITIAL_DATA = {
//   time: new Date().getTime(),
//   blocks: [
//     {
//       type: "paragraph",
//       data: {
//         text: "",
//         level: 2,
//       },
//     },
//   ],
// };

const RichTextEditor = (INITIAL_DATA_PROP) => {
  const [data, setData] = useState(INITIAL_DATA_PROP);
  
  return (
    <div className="flex flex-col items-center mx-1 my-1 border border-black p-4">
      
      {/* <div className="border border-black prose max-w-[calc(100%-120px)]"> */}
        <Editor 
          data={data} 
          readOnly={false} 
          onChange={setData} 
          editorblock="editorjs-container" 
          classNameProp = "prose w-full max-w-[calc(90%)] sm:max-w-[calc(90%)] md:max-w-[calc(90%)] lg:max-w-[calc(90%)] xl:max-w-[calc(90%)]"
        />
      {/* </div> */}

      <button
        className="border border-black p-1 mt-2 max-w-11"
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

export default RichTextEditor;
