import { unified } from "unified";
import markdown from "remark-parse";
import slate, { defaultNodeTypes, serialize } from "remark-slate";

const DEFAULT_HEADINGS = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

const DESERIALIZE_OPTS = {
  nodeTypes: {
    ...defaultNodeTypes,
    paragraph: "p",
    heading: { ...DEFAULT_HEADINGS },
  },
};

const SERIALIZE_OPTS = {
  nodeTypes: {
    ...defaultNodeTypes,
    paragraph: "p",
    heading: { ...DEFAULT_HEADINGS },
  },
};

export const md_to_slate = (md_str) => {
  const processor = unified().use(markdown).use(slate, DESERIALIZE_OPTS);
  return processor.processSync(md_str).result;
};

export const slate_to_md = (ast) => {
  return ast ? ast.map((v) => serialize(v, SERIALIZE_OPTS)).join("") : "";
};
