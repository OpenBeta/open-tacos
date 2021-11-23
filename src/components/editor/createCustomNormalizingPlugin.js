import { Transforms } from "slate";
import { getPlatePluginWithOverrides } from "@udecode/plate-core";

const withCustomNormalizing = (options) => (editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (node.type === "img") {
      const pos = path[0];
      if (pos > 0) {
        const prevSibling = editor.children[pos - 1];
        // if previous sibling is an empty paragraph, remove it
        if (prevSibling.type === "p" && prevSibling.children[0].text === "") {
          Transforms.removeNodes(editor, { at: [pos - 1] });
          return;
        }
      }
    }
    // Continue with default normilization
    normalizeNode([node, path]);
  };

  return editor;
};

export const createCustomNormalizingPlugin = getPlatePluginWithOverrides(
  withCustomNormalizing
);
