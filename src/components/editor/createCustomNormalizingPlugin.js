import { getChildren } from "@udecode/plate-common";

import { getPlatePluginWithOverrides, isElement } from "@udecode/plate-core";

const withCustomNormalizing = (options) => (editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    //console.log("#foos ", node);

    if (node.type === "p") {
      for (const child of node.children) {
        console.log("# node", child);
        //return;
      }
    }
    //   if ( ) {
    //     // do some transformations
    //     return // if transformed
    //   }

    normalizeNode([node, path]); // continue the normalization chain if not transformed
  };

  return editor;
};

export const createCustomNormalizingPlugin = getPlatePluginWithOverrides(
  withCustomNormalizing
);
