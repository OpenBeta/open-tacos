import React, { useState, useEffect } from "react";
import PlateEditor from "./PlateEditor";
import axios from "axios";
import queryString from "query-string";

import fm from "front-matter";

//TODO: make this a configurable option in gatsby-config.js
const CONTENT_BRANCH = "develop";

export const Editor = () => {
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
          setValue(md.body);
        }
      }
      if (parsed.debug === 'true') {
        setDebug(true);
      }
    };
    get_file_from_github();
  }, []);

  const onSubmit = ({ markdown }) => {
    console.log("## commit to github > ", markdown);
  };

  return <PlateEditor markdown={value} onSubmit={onSubmit} debug={debug} />;
};

export const client = axios.create({
  baseURL: "https://raw.githubusercontent.com/OpenBeta/opentacos-content",
});

export default Editor;
