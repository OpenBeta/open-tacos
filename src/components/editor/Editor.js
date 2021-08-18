import React, { useState, useEffect } from "react";
import { navigate } from "gatsby";
import axios from "axios";
import queryString from "query-string";
import fm from "front-matter";
import yaml from "js-yaml";

import { useStoreEditorState } from "@udecode/plate";

import PlateEditor from "./PlateEditor";
import FronmatterForm from "./FrontmatterForm";
import { md_to_slate, slate_to_md } from "./md-utils";

//TODO: make this a configurable option in gatsby-config.js
const CONTENT_BRANCH = "develop";

export const Editor = ({ formik }) => {
  const formikRef = React.useRef(null);
  const editor = useStoreEditorState();

  const [value, setValue] = useState(null);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    const get_file_from_github = async () => {
      const parsed = queryString.parse(location.search);
      if (parsed.file) {
        const res = await client.get(
          `${CONTENT_BRANCH}/content/${parsed.file}`
        );
        if (res.status === 200) {
          const md = fm(res.data);
          setValue(md);
        }
      }
      if (parsed.debug === "true") {
        setDebug(true);
      }
    };
    get_file_from_github();
  }, []);

  const onSubmit = () => {
    if (!(editor || editor.children)) {
      return;
    }
    if (!(formikRef || formikRef.current || formikRef.current.values)) {
      return;
    }
    const md = {
      frontmatter: yaml.dump(formikRef.current.values),
      body: slate_to_md(editor.children),
    };
    console.log("## commit to github > ", md);
  };

  return (
    <>
      <Header onSubmit={onSubmit} />
      <FronmatterForm
        formikRef={formikRef}
        frontmatter={(value && value.attributes) || null}
      />
      <PlateEditor
        markdown={(value && value.body) || null}
        debug={debug}
      />
    </>
  );
};

const Header = ({ onSubmit }) => {
  return (
      <div className="pt-16 flex justify-end gap-2">
        <button
          className="btn btn-link btn-default"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onSubmit}>
          Submit
        </button>
      </div>
  );
};
export const client = axios.create({
  baseURL: "https://raw.githubusercontent.com/OpenBeta/opentacos-content",
});

export default Editor;
