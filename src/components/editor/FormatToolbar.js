import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import {
  useStoreEditorRef,
  useEventEditorId,
  getPlatePluginType,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_H1,
  ELEMENT_H2,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_UNDERLINE,
  ToolbarElement,
  ToolbarMark,
  ToolbarLink,
} from "@udecode/plate";

import {
  IconBold,
  IconItalic,
  IconCode,
  IconH1,
  IconH2,
  IconPhoto,
} from "./ToolbarIcons";

const FormatToolbar = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log("# file ", acceptedFiles)
    // Do something with the files
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const editor = useStoreEditorRef(useEventEditorId("focus"));
  return (
    <div className="max-w-full flex nowrap items-center	pt-1.5 gap-x-4 border-b px-4 bg-gray-100 rounded-t-lg">
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<IconBold />}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<IconItalic />}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_CODE)}
        icon={<IconCode />}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H1)}
        icon={<IconH1 />}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H2)}
        icon={<IconH2 />}
      />
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <ToolbarElement
          //type={getPlatePluginType(editor, ELEMENT_H2)}
          icon={<IconPhoto />}
        />
      </div>
      {/* Comment out due to https://github.com/udecode/plate/issues/938
       <ToolbarLink icon={<IconURL />} /> */}
    </div>
  );
};

export default FormatToolbar;
