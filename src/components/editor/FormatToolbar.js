import React from "react";
import {
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
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_UNDERLINE,
  ToolbarElement,
  ToolbarMark,
} from "@udecode/plate";

import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconCode,
  IconH1,
} from "./components";

const FormatToolbar = () => {
  const editor = useStoreEditorRef(useEventEditorId("focus"));
  return (
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
  );
};

export default FormatToolbar;
