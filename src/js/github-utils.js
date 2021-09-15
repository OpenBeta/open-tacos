import queryString from "query-string";
import fm from "front-matter";

import { GithubClient } from "./GithubClient";

export const CONTENT_BRANCH = "edit-test";
export const CONTENT_BASEDIR = "content";

/**
 * Get a raw file
 */
export const get_raw_content = async (path, branch, authToken) => {
  const github = new GithubClient({
    authToken,
    baseBranch: branch,
  });

  return await github.fetchFile(path, true);
};

/**
 * Get a markdown file from query string ?file=<path to file> and split it to frontmatter + body.
 * Frontmatter is converted to json object.
 * @param authToken
 */
export const get_markdown_file = async (authToken) => {
  const parsed = queryString.parse(location.search);
  if (parsed.file) {
    const _path = `${CONTENT_BASEDIR}/${parsed.file}`;
    const data = await get_raw_content(_path, CONTENT_BRANCH, authToken);
    data.content = fm(data.content);
    return data;
  }

  throw new Error("Missing or invalid file ");
};

/**
 * Commit file to GitHub
 * @param {string} str Content of markdown file
 * @param {string} path path of file
 * @param {string} sha SHA of previous commit
 * @param {Object} committer Committer object
 * @param {string} authToken Auth0 token
 */
export const write_markdown_file = async (
  str,
  path,
  sha,
  committer,
  message,
  authToken
) => {
  const github = new GithubClient({
    authToken,
    baseBranch: CONTENT_BRANCH,
  });
  return await github.commit(path, sha, str, committer, message);
};
