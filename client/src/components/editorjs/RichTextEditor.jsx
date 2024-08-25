import React, { useState } from "react";
import Editor from "./EditorComponent";
import './editorjs.css'

const RichTextEditor = ({INITIAL_DATA_PROP, onSave, readOnly=false, buttonText="Post", isEditingPost=true}) => {
  const [data, setData] = useState(INITIAL_DATA_PROP);
  
  return (
    <div className="flex flex-col items-center mx-1 my-1  min-w-[60vw]">
      
      {/* <div className="border border-black prose max-w-[calc(100%-120px)]"> */}
        <Editor 
          data={data} 
          readOnly={readOnly}
          onChange={setData} 
          editorblock="editorjs-container" 
          classNameProp = "prose w-full max-w-[calc(90%)] sm:max-w-[calc(90%)] md:max-w-[calc(90%)] lg:max-w-[calc(90%)] xl:max-w-[calc(90%)]"
        />
      {/* </div> */}

      { isEditingPost ? (
        <button
          className="border border-black p-1 mt-2"
          onClick={() => {
            // alert(JSON.stringify(data));
            // console.log(data);  
            onSave(data)
          }}
        >
          {buttonText}
        </button>
      ) : (<></>)
      }

    </div>
  );
};

export default RichTextEditor;
