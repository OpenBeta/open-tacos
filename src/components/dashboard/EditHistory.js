import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ReactPlaceholder from "react-placeholder";

import { RowPlaceholder } from "../../pages/history";
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

      const github = new GithubClient({ authToken });
      const list = await github.getAllCommits(author.email);
      setLoading(false);
      setCommits(transform(list));
    };

    getAuth0Token();
  }, [getAccessTokenSilently, user]);

  return (
    <div className="mt-16">
      <div className="md-h1">My Recent edits</div>
      <table className="w-full history-table table-auto">
        <thead>
          <tr className="border-b-2 border-gray-900">
            <th className="w-8">No.</th>
            <th>Age</th>
            <th>Description</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          <ReactPlaceholder
            ready={!loading}
            customPlaceholder={<RowPlaceholder />}
          >
            {commits.length === 0 && !loading && "None"}
            {commits.map((entry, index) => (
              <Commit key={entry.sha} index={index + 1} {...entry} />
            ))}
          </ReactPlaceholder>
        </tbody>
      </table>
    </div>
  );
}

export const Commit = ({ index, sha, html_url, name, date, message }) => {
  return (
    <tr className="even:bg-gray-100">
      <td className="text-sm font-extralight text-gray-500">{index}.</td>
      <td className="font-light">{dayjs(date).fromNow()}</td>
      <td>
        <a
          href={html_url}
          className="cursor-pointer hover:text-custom-secondary hover:underline "
          target="_blank"
          rel="noreferrer noopener"
        >
          {message}
        </a>
      </td>
      <td className="font-light">{name}</td>
    </tr>
  );
};

/**
 * Flatten GitHub response object.
 * See https://docs.github.com/en/rest/reference/repos#list-commits
 * @param {Array} list
 */
export const transform = (list) => {
  if (!list) return [];
  const newList = list.map(({ sha, html_url, commit }) => {
    const { author, message } = commit;
    const { date, name } = author;
    return { sha, html_url, date, age: dayjs(date).fromNow(), message, name };
  });
  return newList;
};

export default EditHistory;
