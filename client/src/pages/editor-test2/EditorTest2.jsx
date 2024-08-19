import React, { useState } from "react";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./tools";
import DisplayComponent from "./DisplayComponent";

const ReactEditorJS = createReactEditorJS();

const EditorTest2 = () => {
  const editorCore = React.useRef(null);
  const [editorData, setEditorData] = useState(null);

  const handleInitialize = React.useCallback((instance) => {
    editorCore.current = instance;
  }, []);

  const handleSave = React.useCallback(async () => {
    if (!editorCore.current) {
      return;
    }
    try {
      const savedData = await editorCore.current.save();
      setEditorData(savedData);
      console.log("Saved data: ", savedData);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }, []);

  return (
    <div className="prose sm:mx-[60px] sm:max-w-[calc(100%-120px)]">
      <ReactEditorJS
        onInitialize={handleInitialize}
        tools={EDITOR_JS_TOOLS}
        placeholder="Start writing or click + for more options"
      />

      <button className="border border-black p-1" onClick={handleSave}>
        Save Content
      </button>

      {editorData && <DisplayComponent data={editorData} />}
    </div>
  );
};

export default EditorTest2;
