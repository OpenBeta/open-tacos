[![Build Status](https://www.travis-ci.com/OpenBeta/open-tacos.svg?branch=develop)](https://www.travis-ci.com/OpenBeta/open-tacos) [![License](https://img.shields.io/github/license/openbeta/open-tacos?style=flat-square)](./LICENSE)

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
gatsby develop -S
```

5. Optional: Run the app in docker
   Requirements:
   [Docker](https://docs.docker.com/get-docker/)

```
docker compose up
```

Changes in your local ./src file will be available on localhost:8000
If you install new packages you will need to rebuild the docker image with

```
docker compose up --build
```

The application is now available at `https://localhost:8000`

## Troubleshooting

Windows development + [opentacos-content](https://github.com/OpenBeta/opentacos-content)
1. Filename too long

> fatal: cannot create directory at 'content/USA/Washington/Central-East Cascades, Wenatchee,  Leavenworth/Leavenworth/Tumwater Canyon/Bouldering in Tumwater Canyon/Beach and Forest Area, The/Beach Parking Boulders, The/Grasshopper, The': Filename too long

```
# Solution
git config --system core.longpaths true
```

Some versions of Git installed on Windows use a different file API that limits the filename path length. 


## How to contribute

See [How to contribute guide](CONTRIBUTING.md) for more details.

## Contributors

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://openbeta.io"><img src="https://avatars.githubusercontent.com/u/3805254?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Viet Nguyen</b></sub></a><br /><a href="https://github.com/OpenBeta/open-tacos/commits?author=vnugent" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/catman237"><img src="https://avatars.githubusercontent.com/u/58540291?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Greg Hughes</b></sub></a><br /><a href="https://github.com/OpenBeta/open-tacos/commits?author=catman237" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/on3iropolos"><img src="https://avatars.githubusercontent.com/u/7380236?v=4?s=100" width="100px;" alt=""/><br /><sub><b>on3iropolos</b></sub></a><br /><a href="#ideas-on3iropolos" title="Ideas, Planning, & Feedback">🤔</a> <a href="#financial-on3iropolos" title="Financial">💵</a></td>
    <td align="center"><a href="http://kevinnadro.com"><img src="https://avatars.githubusercontent.com/u/1581329?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kevin Nadro</b></sub></a><br /><a href="https://github.com/OpenBeta/open-tacos/commits?author=nadr0" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/rytheranderson"><img src="https://avatars.githubusercontent.com/u/43506100?v=4?s=100" width="100px;" alt=""/><br /><sub><b>rytheranderson</b></sub></a><br /><a href="https://github.com/OpenBeta/open-tacos/commits?author=rytheranderson" title="Code">💻</a> <a href="#content-rytheranderson" title="Content">🖋</a></td>
    <td align="center"><a href="http://ygingras.net"><img src="https://avatars.githubusercontent.com/u/169930?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yannick Gingras</b></sub></a><br /><a href="#ideas-ygingras" title="Ideas, Planning, & Feedback">🤔</a> <a href="#content-ygingras" title="Content">🖋</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome.

## License

AGPL
