import React from "react";

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
  IconUnderline,
  IconCode,
  IconURL,
  IconH1,
  IconH2,
} from "./components";

const FormatToolbar = () => {
  const editor = useStoreEditorRef(useEventEditorId("focus"));
  return (
    <div className="flex nowrap gap-x-4 border-b pt-4 pb-2 px-4 bg-gray-100">
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

      {/* Comment out due to https://github.com/udecode/plate/issues/938
       <ToolbarLink icon={<IconURL />} /> */}
    </div>
  );
};

export default FormatToolbar;
