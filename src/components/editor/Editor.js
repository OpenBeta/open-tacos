import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "query-string";
import fm from "front-matter";
import { useAuth0 } from "@auth0/auth0-react";
import PlateEditor from "./PlateEditor";

// TODO: make this a configurable option in gatsby-config.js
// https://trello.com/c/K2T4B6K6
const CONTENT_BRANCH = "develop";

export const Editor = () => {
  const { isAuthenticated } =  useAuth0();

  const [errorIO, setErrorIO] = useState(false);
  const [value, setValue] = useState(null);
  const [debug, setDebug] = useState(false);

  useEffect(async () => {
    const get_file_from_github = async () => {
      const parsed = queryString.parse(location.search);
      if (parsed.file) {
        try {
          const res = await client.get(
            `${CONTENT_BRANCH}/content/${parsed.file}`
          );
          if (res.status === 200) {
            const md = fm(res.data);
            setValue(md.body);
          } else {
            setErrorIO(true);
          }
        } catch (e) {
          setErrorIO(true);
        }
      }
      if (parsed.debug === "true") {
        setDebug(true);
      }
    };
    get_file_from_github();
  }, []);

  const onSubmit = ({ markdown }) => {
    console.log("## commit to github > ", markdown);
  };
  return (
    <>
      {errorIO && <ErrorMessage />}
      { isAuthenticated && <PlateEditor markdown={value} onSubmit={onSubmit} debug={debug} /> }
    </>
  );
};

const ErrorMessage = () => (
  <div className="border p-4">
    <span>Oops, something went wrong.</span>
    <button className="btn btn-link" onClick={() => window.location.reload()}>
      Try again
    </button>
  </div>
);

export const client = axios.create({
  baseURL: "https://raw.githubusercontent.com/OpenBeta/opentacos-content",
});

export default Editor;
