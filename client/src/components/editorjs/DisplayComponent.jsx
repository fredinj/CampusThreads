import React, { useMemo } from "react";
import edjsHTML from "editorjs-renderer";

// Supported Block Types
//     Header (H1-H6)
//     Lists (Ordered & Unordered)
//     Nested Lists
//     Image
//     Delimiter
//     Paragraph
//     Quote
//     Code
//     Embed

const ContentDisplay = ({ data }) => {
  const editorHtmlParser = useMemo(() => edjsHTML(), []);
  const htmlContent = useMemo(
    () => editorHtmlParser.parse(data),
    [data, editorHtmlParser],
  );

  return (
    <div
      className="output-content prose"
      dangerouslySetInnerHTML={{ __html: htmlContent.join("") }}
    />
  );
};

export default ContentDisplay;
