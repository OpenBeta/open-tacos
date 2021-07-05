module.exports ={
  parser: "@babel/eslint-parser", // uses babel-eslint transforms
  parserOptions: {
    ecmaVersion: 9,
    requireConfigFile: false
  },
  "rules": {
    "no-unused-var": 1,
    "react/prop-types": 0,
    "no-useless-escape": 0,
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [
        1,
        {
            "extensions": [
                ".js",
                ".jsx"
            ]
        }
    ],
    "react/display-name": 1
  },
  settings: {
    "react": {
      "version": "detect" // detect react version
    }
  },
  "env": {
    "browser": true,
    "node": true 
  },
  plugins: [
    "react",
    "jest"
  ],
  extends: [
    "eslint:recommended", // use recommended configs
    "plugin:react/recommended",
    "plugin:jest/recommended"
  ]
}
