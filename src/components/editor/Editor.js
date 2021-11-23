import React, { useState, useEffect } from "react";
import ReactPlaceholder from "react-placeholder";
import { usePlateValue } from "@udecode/plate-core";
import { useAuth0 } from "@auth0/auth0-react";
import { navigate } from "gatsby";

import PlateEditor from "./PlateEditor";
import FronmatterForm from "./ClimbProfile";
import AreaProfile from "./AreaProfile";
import CommitSubject from "./CommitSubject";
import ProfilePlaceholder from "./ProfilePlaceholder";
import PageHeader from "./PageHeader";
import ErrorMessage from "./ErrorMessage";
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

export const ERROR = Object.freeze({
  NO_ERROR: {
    code: 0,
    msg: "",
  },
  FILE_LOAD_ERROR: {
    code: 5,
    msg: "Oops, an error has occurred while loading content from the server.  Please refresh your browser.  If the problem persists, notify us at support@openbeta.io",
    cause: "Error loading file from GitHub",
  },
  FILE_WRITE_ERROR: {
    code: 10,
    msg: "Oops, we couldn't save your edit.  Please submit again.  If the problem persists,  notify us at support@openbeta.io",
    cause: "Error writing file to GitHub",
  },
  FILE_CONFLICT_ERROR: {
    code: 20,
    msg: "Ay, caramba! Someone has just submitted an edit right before you did.  We tried but couldn't merge your changes with theirs.  Notify us at support@openbeta.io",
    cause: "Error writing file to GitHub",
  },
});

export const Editor = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  // to get access to commit message
  const commitMsgRef = React.useRef(null);
  // to get access to climb metadata
  const formikRef = React.useRef(null);
  // to get access climb content
  const plateValue = usePlateValue();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(ERROR.NO_ERROR);
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
        console.log(e);
        setError(ERROR.FILE_LOAD_ERROR);
      }
    };
    get_file_from_github();
  }, []);

  const onSubmit = async () => {
    if (!plateValue) return;

    if (!areFormsValid([formikRef, commitMsgRef])) {
      return;
    }

    try {
      const authToken = await getAccessTokenSilently({
        audience: "https://git-gateway",
      });
      const str = stringify({
        frontmatter: formikRef.current.values,
        body_ast: plateValue,
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
      switch (e.httpStatus) {
        case 409:
          setError(ERROR.FILE_CONFLICT_ERROR);
          break;
        case 422:
          console.log("GitHub commit error", e);
        default:
          setError(ERROR.FILE_WRITE_ERROR);
          break;
      }
    } finally {
      setSubmitting(false);
    }
  };

  const { attributes, body } = fileObj.content;
  const editType = get_type(attributes);
  return (
    <>
      <ErrorMessage {...error} setError={setError} />
      <PageHeader
        onSubmit={onSubmit}
        submitting={submitting}
        editType={editType}
      >
        <CommitSubject formikRef={commitMsgRef} />
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
        <PlateEditor markdown={body} debug={false} />
      </div>
    </>
  );
};

/**
 * Determine if we're editing a climb, a boulder problem or an area
 * @param fm  frontmatter object
 */
const get_type = (fm) => {
  if (fm) {
    if (fm.route_name) return "climb";
    if (fm.area_name) return "area";
    if (fm.problem_name) return "problem";
    return "unknown";
  }
  return "unknown";
};

const areFormsValid = (refs) =>
  refs.every(
    (ref) => ref && ref.current && Object.keys(ref.current.errors).length === 0
  );

export default Editor;
