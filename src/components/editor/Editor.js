import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "query-string";
import fm from "front-matter";
import yaml from "js-yaml";
import ReactPlaceholder from "react-placeholder";
import { useStoreEditorState } from "@udecode/plate";

import PlateEditor from "./PlateEditor";
import FronmatterForm from "./ClimbProfile";
import AreaProfile from "./AreaProfile";
import ProfilePlaceholder from "./ProfilePlaceholder";
import PageHeader from "./PageHeader";
import { slate_to_md } from "./md-utils";

//TODO: make this a configurable option in gatsby-config.js
const CONTENT_BRANCH = "develop";

export const Editor = () => {
  const formikRef = React.useRef(null);
  const editor = useStoreEditorState();

  const [errorIO, setErrorIO] = useState(false);
  const [value, setValue] = useState(null);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    const get_file_from_github = async () => {
      const parsed = queryString.parse(location.search);
      if (parsed.file) {
        try {
          const res = await client.get(
            `${CONTENT_BRANCH}/content/${parsed.file}`
          );
          if (res.status === 200) {
            const md = fm(res.data);
            setValue(md);
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

  const editType = get_type(value);

  return (
    <>
      <PageHeader onSubmit={onSubmit} editType={editType}>
        {errorIO ? (
          <IOErrorMessage />
        ) : (
          <div className="text-gray-700">
            You are in edit mode. Changes will not be saved until submit.
          </div>
        )}
      </PageHeader>
      <div className="layout-edit-narrow 2xl:layout-edit-wide">
        <ReactPlaceholder
          customPlaceholder={<ProfilePlaceholder />}
          ready={editType === "climb" || editType === "area"}
        >
          {editType === "climb" && (
            <FronmatterForm
              formikRef={formikRef}
              frontmatter={(value && value.attributes) || null}
            />
          )}
          {editType === "area" && (
            <AreaProfile
              formikRef={formikRef}
              frontmatter={(value && value.attributes) || null}
            />
          )}
        </ReactPlaceholder>
        <PlateEditor markdown={(value && value.body) || null} debug={debug} />
      </div>
    </>
  );
};

/**
 * Determine if we're editing a climb, a boulder problem or an area
 * @param  fm frontmatter object
 */
const get_type = (md) => {
  if (md && md.attributes) {
    const fm = md.attributes;
    if (fm.route_name) return "climb";
    if (fm.area_name) return "area";
    if (fm.problem_name) return "problem";
    return "unknown";
  }
  return "unknown";
};

const IOErrorMessage = () => (
  <div className="text-sm">
    <span>Oops, something went wrong.</span>
    <button
      className="btn btn-link text-sm"
      onClick={() => window.location.reload()}
    >
      Try again
    </button>
  </div>
);

export const client = axios.create({
  baseURL: "https://raw.githubusercontent.com/OpenBeta/opentacos-content",
});

export default Editor;
