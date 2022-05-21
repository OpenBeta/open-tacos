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

export function b64EncodeUnicode (str: string): string | null {
  if (window.btoa != null) {
    return window.btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match: string, p1: string) {
        return String.fromCharCode(Number(`0x${p1}`))
      })
    )
  }
  return null
}
