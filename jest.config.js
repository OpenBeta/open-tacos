const nextEnv = require('@next/env')

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom',

  moduleDirectories: ['node_modules', '<rootDir>/'],

  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1'
  }
}

const projectDir = process.cwd()
nextEnv.loadEnvConfig(projectDir)

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
