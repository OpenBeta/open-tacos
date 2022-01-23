import queryString from 'query-string'
import fm from 'front-matter'

import { GithubClient } from './GithubClient'

export const CONTENT_BRANCH = 'develop'
export const CONTENT_BASEDIR = 'content'

/**
 * Get a raw file
 */
export const getRawContent = async (path: string, branch: string, authToken: string): Promise<any> => {
  const github = new GithubClient({
    authToken,
    baseBranch: branch
  })

  return await github.fetchFile(path, true)
}

/**
 * Get a markdown file from query string ?file=<path to file> and split it to frontmatter + body.
 * Frontmatter is converted to json object.
 * @param authToken
 */
export const getMarkdownFile = async (authToken: string): Promise<unknown> => {
  const parsed = queryString.parse(window.location.search)
  if (parsed.file === '') {
    const _path = `${CONTENT_BASEDIR}/${parsed.file}`
    const data = await getRawContent(_path, CONTENT_BRANCH, authToken)
    data.content = fm(data.content.toString())
    return data
  }

  throw new Error('Missing or invalid file ')
}

/**
 * Commit file to GitHub
 * @param {string} str Content of markdown file
 * @param {string} path path of file
 * @param {string} sha SHA of previous commit
 * @param {Object} committer Committer object
 * @param {string} authToken Auth0 token
 */
export const writeMarkdownFile = async (
  str: string,
  path: string,
  sha: string,
  committer: string,
  message: string,
  authToken: string
): Promise<any> => {
  const github = new GithubClient({
    authToken,
    baseBranch: CONTENT_BRANCH
  })
  return await github.commit(path, sha, str, committer, message)
}
