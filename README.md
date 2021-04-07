# OpenTacos
OpenTacos is an proof-of-concept/MVP showing it's possible to build a collaborative climbing route catalog.

## Tech stack
For now frontend code and data files live in the same repo.  They will be separated in the future.

1. Data:
- Climbing route data such as name, grade, FA, etc are stored in human-readable text files (markdown syntax),
- Take advantage of folder and file structure to organize crag/area and climb relationship.
- Git-based CMS: Use Git for user management, access control, content review.

2. Frontend:
- Gatsby.js, React.js, TailwindCSS

Learn more about [Jamstack](https://jamstack.org)

Note: 

## How to build
Make sure you have the following Javascript tools installed on your computer
- [Node](https://nodejs.org)
- [npm](https://www.npmjs.com/get-npm)
- Optional: [yarn](https://classic.yarnpkg.com/en/docs/install)

1.  Download the repo to your local machine
```
git clone git@github.com:OpenBeta/open-tacos.git
```

2.  Build the code
```
cd open-tacos
yarn install
```
3.  Run the app
```
gatsby develop
```
The application will be run at `http://localhost:8000`

## License
AGPL

