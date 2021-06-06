[![Build Status](https://www.travis-ci.com/OpenBeta/open-tacos.svg?branch=develop)](https://www.travis-ci.com/OpenBeta/open-tacos)  [![License](https://img.shields.io/github/license/openbeta/open-tacos?style=flat-square)](./LICENSE)

# OpenTacos
OpenTacos is a proof-of-concept/MVP showing it's possible to build a collaborative climbing route catalog.

[Live demo](https://tacos.openbeta.io/areas/105732162/black-velvet-wall) 🚀

## Tech stack

1. Data: (see [opentacos-content](https://github.com/OpenBeta/opentacos-content))
- Climbing route data such as name, grade, FA, etc are stored in human-readable text files (markdown syntax)
- Take advantage of folder and file structure to organize crag/area and climb relationship.
- Git-based CMS: Use Git for user management, access control, content review.

2. Frontend: (this repo)
- Gatsby.js, React.js, TailwindCSS

Learn more about [Jamstack](https://jamstack.org)

## How to build
Make sure you have the following Javascript tools installed on your computer
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

3.  Download the data to local cache
```
# Note: run this script as needed 
./prebuild.sh
```

4.  Run the app
```
gatsby develop
```
The application will be run at `http://localhost:8000`

## License
AGPL