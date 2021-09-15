import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ReactPlaceholder from "react-placeholder";

import { GithubClient } from "../../js/GithubClient";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function EditHistory() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getAuth0Token = async () => {
      setLoading(true);
      const authToken = await getAccessTokenSilently({
        audience: "https://git-gateway",
      });

      const author = {
        name: user["https://tacos.openbeta.io/username"],
        email: user["https://tacos.openbeta.io/username"] + "@noreply",
      };

      const github = new GithubClient({ authToken, baseBranch: "edit-test" });
      const list = await github.getCommitsByUser(author.email);
      setLoading(false);
      setCommits(transform(list));
    };

    getAuth0Token();
  }, [getAccessTokenSilently, user]);

  return (
    <div className="mt-16">
      <div className="text-lg">Recent edits</div>
      <div className="divide-y">
        <ReactPlaceholder
          className="mt-4"
          type="text"
          ready={!loading}
          rows={2}
          color="#F4F6F6"
        >
          {commits.length === 0 && !loading && "None"}
          {commits.map((entry) => (
            <Commit key={entry.sha} {...entry} />
          ))}
        </ReactPlaceholder>
      </div>
    </div>
  );
}

const Commit = ({ sha, html_url, date, message }) => {
  return (
    <div className="py-4 flex gap-x-8">
      <span>{dayjs(date).fromNow()}</span>
      <span>{message}</span> 
      <span className="text-gray-500">{sha.substring(sha.length - 8)}</span>
      <a
        className="text-gray-500 underline hover:text-custom-secondary"
        href={html_url}
        target="_blank"
        rel="noreferrer noopener"
      >
        github
      </a>
    </div>
  );
};

/**
 * Flatten GitHub response object.  
 * See https://docs.github.com/en/rest/reference/repos#list-commits
 * @param {Array} list 
 */
const transform = (list) => {
  if (!list) return []
  const newList = list.map(({ sha, html_url, commit }) => {
    const { author, message } = commit;
    const { date } = author;
    return { sha, html_url, date, message };
  });
  return newList;
};

export default EditHistory;
