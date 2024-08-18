import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";

export const EDITOR_JS_TOOLS = {
  // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    config: { placeholder: "Enter text" },
  },
  embed: Embed,
  // table: Table,
  list: {
    class: List,
    inlineToolbar: true,
  },
  // warning: Warning,
  code: {
    class: Code,
    config: { placeholder: "Enter your code" },
  },
  // linkTool: LinkTool,
  image: Image,
  // raw: Raw,
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: "Enter a header",
      levels: [1, 2, 3, 4, 5, 6],
    },
  },
  quote: Quote,
  marker: {
    class: Marker,
    inlineToolbar: true,
  },
  // checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
};
