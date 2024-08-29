import React, { useState } from "react";
import Editor from "./EditorComponent";
import './editorjs.css';
import Button from '@mui/material/Button';

const RichTextEditor = ({ INITIAL_DATA_PROP, onSave, readOnly = false, buttonText = "Post", isEditingPost = true }) => {
  const [data, setData] = useState(INITIAL_DATA_PROP);

  return (
    <div className="flex flex-col items-center w-full my-1">
      
      {/* Editor Component */}
      <Editor 
        data={data} 
        readOnly={readOnly}
        onChange={setData} 
        editorblock="editorjs-container" 
        classNameProp="prose w-full max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[70%]"
      />

      {/* Save Button */}
      {isEditingPost && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSave(data)}
          className="mt-4"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default RichTextEditor;
