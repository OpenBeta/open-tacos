const nextEnv = require('@next/env')

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/src/js/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom'
}

const projectDir = process.cwd()
nextEnv.loadEnvConfig(projectDir)

// react-markdown and the autolink packages are ESM-only. next/jest ignores all of
// node_modules and only lets a project append more ignore rules, so replace the
// list here and compile just that markdown set. This does not affect the Next build.
const esmMarkdownPackages = '/node_modules/(?!(@ungap/structured-clone/|bail/|ccount/|character-|comma-separated-tokens/|decode-named-character-reference/|devlop/|escape-string-regexp/|estree-util-is-identifier-name/|hast-util-|html-url-attributes/|is-alphabetical/|is-alphanumerical/|is-decimal/|is-hexadecimal/|is-plain-obj/|longest-streak/|mdast-util-|micromark|parse-entities/|property-information/|react-markdown/|remark-|space-separated-tokens/|stringify-entities/|trim-lines/|trough/|unified/|unist-util-|vfile|zwitch/))'

module.exports = async () => {
  const config = await createJestConfig(customJestConfig)()
  config.transformIgnorePatterns = [
    esmMarkdownPackages,
    '^.+\\.module\\.(css|sass|scss)$'
  ]
  return config
}
