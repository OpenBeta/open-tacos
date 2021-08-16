import React, { useState, useEffect } from "react";
import PlateEditor from "./PlateEditor";
import Loadable from "@loadable/component";
import axios from "axios";
import queryString from "query-string";

import fm from "front-matter";

export const Editor = () => {
  const [value, setValue] = useState(null);
  useEffect(() => {
    const get_file_from_github = async () => {
      // await new Promise(r => setTimeout(r, 3000));

      const parsed = queryString.parse(location.search);
      if (parsed.file) {
        const res = await client.get(`develop/content/${parsed.file}`);
        if (res.status === 200) {
          const md = fm(res.data);
          setValue(md.body);
        }
      }
    };
    get_file_from_github();
  }, []);

  const onSubmit = ({ markdown }) => {
    console.log("## commit to github > ", markdown);
  };

  return <PlateEditor markdown={value} onSubmit={onSubmit} />;
};

export const client = axios.create({
  baseURL: "https://raw.githubusercontent.com/OpenBeta/opentacos-content",
});

export default Editor;
