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
  createImagePlugin,
  createDeserializeMDPlugin,
  createTrailingBlockPlugin,
  createNormalizeTypesPlugin,
  withProps,
  ImageElement,
  ELEMENT_IMAGE,
  ELEMENT_H1,
  ELEMENT_PARAGRAPH
} from "@udecode/plate";
import {useDropzone} from 'react-dropzone';
import FormatToolbar from "./FormatToolbar";
import {createCustomNormalizingPlugin} from "./createCustomNormalizingPlugin"
import { md_to_slate } from "./md-utils";

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
    createImagePlugin(),
    ...createBasicElementPlugins(),
    ...createBasicMarkPlugins(),
    createTrailingBlockPlugin({ type: ELEMENT_PARAGRAPH }),
    createNormalizeTypesPlugin({
      rules: [{ path: [0], strictType: ELEMENT_H1 }],
    }),
    createCustomNormalizingPlugin()
  ];

  plugins.push(...[createDeserializeMDPlugin({ plugins })]);
  const [value, setValue] = useState();

  const onChange = (props) => setValue(props);

  const ast = md_to_slate(markdown);
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
            initialValue={ast}
            onChange={onChange}
          ></Plate>
        </div>
      </ReactPlaceholder>
      <div className="break-all"><pre>{JSON.stringify(value, null, 2)}</pre></div>
    </div>
  );
};

export default PlateEditor;
