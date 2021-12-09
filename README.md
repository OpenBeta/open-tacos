[![Build Status](https://www.travis-ci.com/OpenBeta/open-tacos.svg?branch=develop)](https://www.travis-ci.com/OpenBeta/open-tacos)  [![License](https://img.shields.io/github/license/openbeta/open-tacos?style=flat-square)](./LICENSE)

# OpenTacos
OpenTacos is a proof-of-concept/MVP showing it's possible to build a collaborative climbing route catalog.

[Live demo](https://tacos.openbeta.io) 🚀

## Tech stack

1. Data: (see [opentacos-content](https://github.com/OpenBeta/opentacos-content))
- Climbing route data such as name, grade, FA, etc are stored in human-readable text files (markdown syntax)
- Take advantage of folder and file structure to organize crag/area and climb relationship.
- Git-based CMS: Use Git for user management, access control, content review.

2. Frontend: (this repo)
- Gatsby.js, React.js, TailwindCSS

Learn more about [Jamstack](https://jamstack.org)

## How to build
Make sure you have the following tools installed on your computer
- [Git](https://github.com/git-guides/install-git)
- [Node](https://nodejs.org)
- [npm](https://www.npmjs.com/get-npm)
- [yarn](https://classic.yarnpkg.com/en/docs/install)

0. Install Gatsby CLI 
```
npm install -g gatsby-cli
```

1.  Download the repo to your local machine
```
git clone git@github.com:OpenBeta/open-tacos.git
```

2.  Build the code
```
cd open-tacos
yarn install
```

3.  Download climb data to local cache
```
# Note: run this script as needed
./prebuild.sh
```

4.  Run the app
Since we are using Auth0 for authenticating users, development server needs to run in https mode. 
You will be prompted to install additional components on the first run.
```
npm run develop -- --https
```

The application is now available at `https://localhost:8000`

## How to contribute

See [How to contribute guide](CONTRIBUTING.md) for more details.


## License
AGPL
