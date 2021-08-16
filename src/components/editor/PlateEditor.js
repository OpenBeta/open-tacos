import React, { useState, useEffect } from "react";
import ReactPlaceholder from "react-placeholder";
import { navigate } from "gatsby";
import {
  Plate,
  createBasicElementPlugins,
  createReactPlugin,
  createHistoryPlugin,
  createBasicMarkPlugins,
  createParagraphPlugin,
  createPlateComponents,
  createPlateOptions,
  createBlockquotePlugin,
  createHeadingPlugin,
  createBoldPlugin,
  createItalicPlugin,
  createDeserializeMDPlugin,
  useStoreEditorRef,
  useEventEditorId,
  getPlatePluginType,
} from "@udecode/plate";
import FormatToolbar from "./FormatToolbar";
import { md_to_slate, slate_to_md } from "./md-utils";

// customize the editor inner container
const editableProps = {
  style: {
    padding: "16px",
    //backgroundColor: "#FEF9E7",
  },
};
const PlateEditor = ({ markdown, onSubmit }) => {
  const components = createPlateComponents();
  const options = createPlateOptions();

  const plugins = [
    // editor
    createReactPlugin(),
    createHistoryPlugin(),
    createParagraphPlugin(),
    ...createBasicElementPlugins(),
    ...createBasicMarkPlugins(),
  ];

  plugins.push(...[createDeserializeMDPlugin({ plugins })]);

  const [debugValue, setDebugValue] = useState(null);

  useEffect(() => {
    // Since the markdown prop is a result of an async API call to GitHub
    // we need track it in useEffect
    const slateAST = md_to_slate(markdown);
    setDebugValue(slateAST);
  }, [markdown]);

  const onSubmitLocal = () => {
    onSubmit({ markdown: slate_to_md(debugValue) });
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
          <div className="transition duration-500 opacity-100">
            <Plate
              id="1"
              editableProps={editableProps}
              plugins={plugins}
              components={components}
              options={options}
              value={debugValue}
              onChange={(newValue) => {
                setDebugValue(newValue);
              }}
            ></Plate>
          </div>
        </ReactPlaceholder>
      </div>
    </>
  );
};

export default PlateEditor;
