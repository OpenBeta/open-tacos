import React, { useState, useEffect } from "react";
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

import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_LINK,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TD,
  ELEMENT_TH,
  ELEMENT_TODO_LI,
  ELEMENT_TR,
  ELEMENT_UL,
  MARK_BG_COLOR,
  MARK_BOLD,
  MARK_CODE,
  MARK_COLOR,
  MARK_HIGHLIGHT,
  MARK_ITALIC,
  MARK_KBD,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
  TDescendant,
  ToolbarElement,
  ToolbarMark,
  deserializeMD,
} from "@udecode/plate";

import {
  Button,
  Icon,
  Toolbar,
  IconBold,
  IconItalic,
  IconUnderline,
  IconCode,
  IconH1,
} from "./components";
import { md_to_slate, slate_to_md } from "./md-utils";

const editableProps = {
  style: {
    padding: "15px",
    backgroundColor: "#FEF9E7",
    //height: "4rem"
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
    const slateAST = md_to_slate(markdown);
    setDebugValue(slateAST);
  }, [markdown]);

  const onSubmitLocal = () => {
    onSubmit({ markdown: slate_to_md(debugValue) });
  };

  return (
    <>
      <div className="flex justify-end">
        <button className="btn btn-primary" onClick={onSubmitLocal}>
          Submit
        </button>
      </div>
      <ToolbarButtonsBasicElements />
      <Plate
        id="1"
        editableProps={editableProps}
        plugins={plugins}
        components={components}
        options={options}
        value={debugValue}
        onChange={(newValue) => {
          setDebugValue(newValue);
          // console.log(
          //   newValue.map((v) => serialize(v, deserialized_opts)).join("")
          // );
          // save newValue...
        }}
      >
        {/* value: {JSON.stringify(debugValue)} */}
      </Plate>
    </>
  );
};

const ToolbarButtonsBasicElements = () => {
  const editor = useStoreEditorRef(useEventEditorId("focus"));

  return (
    <>
      <div className="flex nowrap">
        <ToolbarMark
          type={getPlatePluginType(editor, MARK_BOLD)}
          icon={<IconBold />}
        />
        <ToolbarMark
          type={getPlatePluginType(editor, MARK_ITALIC)}
          icon={<IconItalic />}
        />
        <ToolbarElement
          type={getPlatePluginType(editor, ELEMENT_H1)}
          icon={<IconH1 />}
        />
      </div>
    </>
  );
};

export default PlateEditor;
