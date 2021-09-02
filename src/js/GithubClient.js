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

import axios from "axios";

import { b64EncodeUnicode } from "./base64";

export class GithubClient {
  static GATEWAY = "https://git-gateway.openbeta.io/github";
  static WORKING_REPO_COOKIE_KEY = "working_repo_full_name";
  static HEAD_BRANCH_COOKIE_KEY = "head_branch";

  api = axios.create({
    baseURL: GithubClient.GATEWAY,
  });

  constructor({
    baseBranch = "develop",
    defaultCommitMessage = "Update from OpenTacos",
    authToken,
  }) {
    this.baseBranch = baseBranch;
    this.defaultCommitMessage = defaultCommitMessage;
    this.headers = {
      "content-type": "application/json",
      authorization: `Bearer ${authToken}`,
    };
  }

  async createBranch(name) {
    const currentBranch = await this.getBranch();
    const sha = currentBranch.object.sha;
    const response = await this.req({
      url: `${GithubClient.GATEWAY}/git/refs`,
      method: "POST",
      headers: this.headers,
      data: {
        ref: `refs/heads/${name}`,
        sha,
      },
    });

    console.log("### response ", response);

    return response;
  }

  async getBranch() {
    try {
      console.log("## enter getBranch()");
      const branch = this.branchName;
      console.log("#branch ", branch);

      const data = await this.req({
        url: `${GithubClient.GATEWAY}/git/ref/heads/${branch}`,
        method: "GET",
        headers: this.headers,
      });
      return data;
    } catch (e) {
      if ((e.status = 404)) {
        return;
      }
      throw e;
    }
  }

  async commit(
    filePath,
    sha,
    fileContents,
    committer,
    commitMessage = this.defaultCommitMessage
  ) {
    const branch = this.branchName;
    const response = await this.req({
      url: `${GithubClient.GATEWAY}/contents/${removeLeadingSlash(filePath)}`,
      method: "PUT",
      headers: this.headers,
      data: {
        message: commitMessage,
        content: b64EncodeUnicode(fileContents),
        sha,
        branch,
        committer
      },
    });
    return response;
  }

  async fetchFile(filePath, decoded = true) {
    const branch = this.branchName;
    const request = await this.req({
      url: `${GithubClient.GATEWAY}/contents/${removeLeadingSlash(
        filePath
      )}?ref=${branch}`,
      method: "GET",
      headers: this.headers,
    });

    // decode using base64 decoding (https://developer.mozilla.org/en-US/docs/Glossary/Base64)
    request.content = decoded ? atob(request.content || "") : request.content;
    return request;
  }

  get branchName() {
    // const _branchName = this.getCookie(GithubClient.HEAD_BRANCH_COOKIE_KEY);

    // if (_branchName) {
    //   return _branchName;
    // }

    return this.baseBranch;
  }

  async req(data) {
    try {
      const response = await this.api(data);
      console.log(">> req ", response);
      if (response.status.toString()[0] == "2") {
        return response.data;
      }
      // throw new GithubError(
      //   data.message || response.statusText,
      //   response.status
      // );
    } catch (e) {
      console.log(e);
      //throw new GithubError(e);
    }
  }

  async getGithubResponse(response) {
    const data = await response.json();
    //2xx status codes
    if (response.status.toString()[0] == "2") return data;

    throw new GithubError(data.message || response.statusText, response.status);
  }
}

class GithubError extends Error {
  status;
  constructor(message, status) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

function removeLeadingSlash(path) {
  if (path.charAt(0) === "/") {
    return path.substring(1);
  }
  return path;
}
