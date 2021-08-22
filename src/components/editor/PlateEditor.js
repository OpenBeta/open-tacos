import React, { useState, useEffect } from "react";
import ReactPlaceholder from "react-placeholder";
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
    padding: "24px",
    minHeight: "4rem",
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

  return (
      <div className="flex-grow 2xl:w-2/3 2xl:max-w-5xl border-gray-300 border rounded-lg shadow-sm">
        <FormatToolbar />
        <ReactPlaceholder
          className="p-8 mt-12"
          type="text"
          ready={markdown !== null}
          rows={16}
          color="#F4F6F6"
        >
          <div className="transition duration-850 opacity-100">
            <Plate
              editableProps={editableProps}
              plugins={plugins}
              components={components}
              options={options}
              initialValue={md_to_slate(markdown)}
            ></Plate>
          </div>
        </ReactPlaceholder>
      </div>
  );
};

export default PlateEditor;
