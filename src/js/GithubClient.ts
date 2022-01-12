/**
Copyright 2021 Forestry.io Holdings, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import axios, { AxiosInstance } from 'axios'
import { Buffer } from 'buffer'
import { b64EncodeUnicode } from './base64'

interface GithubClientProps {
  baseBranch: string
  defaultCommitMessage: string
  authToken: string
}

export class GithubClient {
  static GATEWAY = 'https://git-gateway.openbeta.io/github'

  static PUBLIC_GITHUB =
  'https://api.github.com/repos/openbeta/opentacos-content'

  static WORKING_REPO_COOKIE_KEY: string = 'working_repo_full_name'

  static HEAD_BRANCH_COOKIE_KEY: string = 'head_branch'

  baseBranch: string

  defaultCommitMessage: string

  authToken: string

  headers: Record<string, string>
  api: AxiosInstance
  constructor ({
    baseBranch = 'develop',
    defaultCommitMessage = 'Update from OpenTacos',
    authToken
  }: GithubClientProps) {
    this.baseBranch = baseBranch
    this.defaultCommitMessage = defaultCommitMessage
    this.headers = {
      'content-type': 'application/json'
    }
    if (authToken !== '') {
      this.headers.authorization = `Bearer ${authToken}`
      this.api = axios.create({
        baseURL: GithubClient.GATEWAY
      })
    } else {
      this.api = axios.create({
        baseURL: GithubClient.PUBLIC_GITHUB
      })
    }
  }

  async createBranch (name: string): Promise<any> {
    const currentBranch = await this.getBranch()
    const sha = currentBranch.object.sha
    const response = await this.req({
      url: `${GithubClient.GATEWAY}/git/refs`,
      method: 'POST',
      headers: this.headers,
      data: {
        ref: `refs/heads/${name}`,
        sha
      }
    })

    return response
  }

  async getBranch (): Promise<any> {
    try {
      const branch = this.branchName

      const data = await this.req({
        url: `${GithubClient.GATEWAY}/git/ref/heads/${branch}`,
        method: 'GET',
        headers: this.headers
      })
      return data
    } catch (e) {
      if (e.status === 404) {
        return
      }
      throw e
    }
  }

  async commit (
    filePath: string,
    sha: string,
    fileContents: string,
    committer: string,
    commitMessage: string = this.defaultCommitMessage
  ): Promise<any> {
    const branch = this.branchName
    const response = await this.req({
      url: `${GithubClient.GATEWAY}/contents/${removeLeadingSlash(filePath)}`,
      method: 'PUT',
      headers: this.headers,
      data: {
        message: commitMessage,
        content: b64EncodeUnicode(fileContents),
        sha,
        branch,
        committer
      }
    })
    return response
  }

  async fetchFile (filePath: string, decoded: boolean = true): Promise<any> {
    const branch = this.branchName
    const request = await this.req({
      url: `${GithubClient.GATEWAY}/contents/${removeLeadingSlash(
        filePath
      )}?ref=${branch}`,
      method: 'GET',
      headers: this.headers
    })

    // decode using base64 decoding (https://developer.mozilla.org/en-US/docs/Glossary/Base64)
    const content: string = (request.content !== undefined) ? request.content : ''
    request.content = decoded ? Buffer.from(content, 'base64') : request.content
    return request
  }

  async getAllCommits (username: string): Promise<any> {
    const branch = this.branchName
    const request: unknown = await this.req({
      url: `commits?sha=${branch}${
        username !== '' ? `&author=${username}` : ''
      }`,
      method: 'GET',
      headers: this.headers
    })
    return request
  }

  get branchName (): string {
    // const _branchName = this.getCookie(GithubClient.HEAD_BRANCH_COOKIE_KEY);

    // if (_branchName) {
    //   return _branchName;
    // }

    return this.baseBranch
  }

  async req (data): Promise<any> {
    try {
      const response = await this.api(data)
      if (response.status.toString()[0] === '2') {
        return response.data
      }
      throw new GithubError(response.statusText, response.status)
    } catch (e) {
      throw new GithubError(e, e.response.status)
    }
  }
}

class GithubError extends Error {
  httpStatus: number
  constructor (message: string, status: number) {
    super(message)
    this.name = 'GithubError'
    this.httpStatus = status
  }
}

function removeLeadingSlash (path: string): string {
  if (path.charAt(0) === '/') {
    return path.substring(1)
  }
  return path
}
