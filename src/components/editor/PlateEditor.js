import React, { useState, useEffect } from "react";
import ReactPlaceholder from "react-placeholder";
import { navigate } from "gatsby";
import {
  Plate,
  createBasicElementPlugins, // h1, h2, blockquote, codeblock and p
  createReactPlugin,
  createHistoryPlugin,
  createBasicMarkPlugins, // bold, italic, underline
  createPlateComponents,
  createPlateOptions,
  createLinkPlugin,
  createDeserializeMDPlugin,
} from "@udecode/plate";
import FormatToolbar from "./FormatToolbar";
import { md_to_slate, slate_to_md } from "./md-utils";

// customize the editor inner container
const editableProps = {
  style: {
    padding: "16px",
    minHeight: "4rem"
    //backgroundColor: "#FEF9E7",
  },
};
const PlateEditor = ({ markdown, onSubmit, debug }) => {
  const components = createPlateComponents();
  const options = createPlateOptions();

  const plugins = [
    // editor
    createReactPlugin(),
    createHistoryPlugin(),
    createLinkPlugin(),
    ...createBasicElementPlugins(),
    ...createBasicMarkPlugins(),
  ];

  plugins.push(...[createDeserializeMDPlugin({ plugins })]);

  const [ast, setAST] = useState(null);

  useEffect(() => {
    // Since 'markdown' prop is a result of an async API call to GitHub,
    // we need track it in useEffect
    const slateAST = md_to_slate(markdown);
    setAST(slateAST);
  }, [markdown]);

  const onSubmitLocal = () => {
    if (debug) {
      console.log("Slate document > ", ast);
    }
    onSubmit({ markdown: slate_to_md(ast) });
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <button
          className="btn btn-link btn-default"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onSubmitLocal}>
          Submit
        </button>
      </div>
      <FormatToolbar />
      <div className="mt-4 border-gray-300 border-2 rounded-lg">
        <ReactPlaceholder
          className="p-4 mt-20"
          type="text"
          ready={markdown !== null}
          rows={16}
          color="#F4F6F6"
        >
          <div className="transition duration-850 opacity-100">
            <Plate
              id="1"
              editableProps={editableProps}
              plugins={plugins}
              components={components}
              options={options}
              value={ast}
              onChange={(newValue) => {
                setAST(newValue);
              }}
            ></Plate>
          </div>
        </ReactPlaceholder>
      </div>
    </>
  );
};

export default PlateEditor;
