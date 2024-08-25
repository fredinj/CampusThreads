import React, { memo, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "./tools";

const Editor = ({ data, onChange, editorblock, readOnly = false, classNameProp }) => {
  const ref = useRef();
  //Initialize editorjs
  useEffect(() => {
    //Initialize editorjs if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: editorblock,

        tools: EDITOR_JS_TOOLS,
        data: data,
        readOnly: readOnly, 
        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
        },
      });
      ref.current = editor;
    }

    //Add a return function to handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);
  return <div 
    className={ classNameProp } 
    id={editorblock} 
    // style={{
    //   '--ce-block-content-width': '100%',
    //   '--ce-block-content-max-width': 'none'
    // }}
    />;
};

// export default Editor;

export default memo(Editor);