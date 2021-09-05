import React, { useState, useEffect } from "react";
import ReactPlaceholder from "react-placeholder";
import { useStoreEditorState } from "@udecode/plate";
import { useAuth0 } from "@auth0/auth0-react";
import { navigate } from "gatsby";

import PlateEditor from "./PlateEditor";
import FronmatterForm from "./ClimbProfile";
import AreaProfile from "./AreaProfile";
import ProfilePlaceholder from "./ProfilePlaceholder";
import CommitSubject from "./CommitSubject";
import PageHeader from "./PageHeader";
import { stringify } from "./md-utils";
import { get_markdown_file, write_markdown_file } from "../../js/github-utils";

// Main state of this component.  Mirror essential fields from the response object
// returned from GitHub Rest API.
// See https://docs.github.com/en/rest/reference/repos#get-repository-content
// (go to 'Response if content is a file' for the response object structure)
// We can add more fields to local state as needed.
// Note: Frontmatter and markdown states are maintained internally
// by Formik and Plate editor respectively.
const initial_state = {
  sha: null,
  path: null,
  content: {
    attributes: null,
    body: null,
  },
};

export const Editor = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  // to get access to commit message
  const commitMsgRef = React.useRef(null);
  // to get access to climb metadata
  const formikRef = React.useRef(null);
  // to get access climb content
  const editor = useStoreEditorState();

  const [submitting, setSubmitting] = useState(false);
  const [errorIO, setErrorIO] = useState(false);
  const [fileObj, setFileObject] = useState(initial_state);

  useEffect(() => {
    const get_file_from_github = async () => {
      try {
        const authToken = await getAccessTokenSilently({
          audience: "https://git-gateway",
        });
        const { sha, path, content } = await get_markdown_file(authToken);
        setFileObject({ sha, path, content });
      } catch (e) {
        setErrorIO(true);
      }
    };
    get_file_from_github();
  }, []);

  const onSubmit = async () => {
    if (!(editor || editor.children)) {
      return;
    }

    if (!areFormsValid([formikRef, commitMsgRef])) {
      return;
    }

    try {
      const authToken = await getAccessTokenSilently({
        audience: "https://git-gateway",
      });
      const str = stringify({
        frontmatter: formikRef.current.values,
        body_ast: editor.children,
      });
      const committer = {
        name: user["https://tacos.openbeta.io/username"],
        email: user["https://tacos.openbeta.io/username"] + "@noreply",
      };

      setSubmitting(true);
      const { path, sha } = fileObj;
      const res = await write_markdown_file(
        str,
        path,
        sha,
        committer,
        commitMsgRef.current.values.message,
        authToken
      );
      navigate("/dashboard");
    } catch (e) {
      //TODO: report error on screen
      console.log(e);
    } finally {
      setSubmitting(false);
    }
  };

  const { attributes, body } = fileObj.content;
  const editType = get_type(attributes);
  return (
    <>
      <PageHeader
        onSubmit={onSubmit}
        submitting={submitting}
        editType={editType}
      >
        <CommitSubject formikRef={commitMsgRef} />
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
            <FronmatterForm formikRef={formikRef} frontmatter={attributes} />
          )}
          {editType === "area" && (
            <AreaProfile formikRef={formikRef} frontmatter={attributes} />
          )}
        </ReactPlaceholder>
        <PlateEditor markdown={body} debug={true} />
      </div>
    </>
  );
};

/**
 * Determine if we're editing a climb, a boulder problem or an area
 * @param  fm frontmatter object
 */
const get_type = (attributes) => {
  if (attributes) {
    if (attributes.route_name) return "climb";
    if (attributes.area_name) return "area";
    if (attributes.problem_name) return "problem";
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

const areFormsValid = (refs) =>
  refs.every(
    (ref) => ref && ref.current && Object.keys(ref.current.errors).length === 0
  );

export default Editor;
