<p align="center" style="padding-top:1rem">
  <a href="https://openbeta.io">
    <img alt="OpenTacos" src="public/tortilla.png" width="60" />
  </a>
</p>
<h1 align="center">
  OpenTacos v0.2
</h1>
<p align="center">
  <strong>
    Open source. Rock climbing.  Wiki.
  </strong>
</p>
<p align="center">
  OpenTacos is a free and open source wiki of rock climbing knowledge.  </br>We are currently in MVP stage looking for feedback from climbers. Chat with the dev team on <a href="https://discord.gg/fY9DbRav8h">Discord</a>.
</p>

<h2 align="center">
  <a href="https://open-tacos.vercel.app">Live demo</a> 🚀
</h2>

<p align="center">
  <a href="https://github.com/OpenBeta/open-tacos/actions/workflows/nodejs.yml?query=branch%3Adevelop"><img src="https://github.com/openbeta/open-tacos/actions/workflows/nodejs.yml/badge.svg?branch=develop" alt="Develop branch"/>
  </a>
  &nbsp;
  <a href="./LICENSE"><img alt="License" src="https://img.shields.io/github/license/openbeta/open-tacos?style=flat-square"/></a>
</p>

## Tech stack

### Important news:

- As of Jan 2022 we've replaced Gatsby.js with Next.js.
- Active development is on [`nextjs`](https://github.com/openbeta/open-tacos/tree/nextjs) branch for the time being.

---

1. Data: (see [opentacos-content](https://github.com/OpenBeta/opentacos-content))

- Climbing route data such as name, grade, FA, etc are stored in human-readable text files (markdown syntax)
- Take advantage of folder and file structure to organize crag/area and climb relationship.
- Git-based CMS: Use Git for user management, access control, content review.

2. Frontend: (this repo)

- Next.js, ~~Gatsby.js,~~ React.js, TailwindCSS

Learn more about [Jamstack](https://jamstack.org)

## Live instances

| Env                | Link                          | Branch  | Content | Build                                                                                                                                                                                                                                     |
| ------------------ | ----------------------------- | ------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Staging            | https://open-tacos.vercel.app | nextjs  | Partial | [![Build](https://img.shields.io/github/checks-status/openbeta/open-tacos/nextjs)](https://github.com/OpenBeta/open-tacos/actions/workflows/nodejs.yml?query=branch%3Anextjs)                                                             |
| Prod (old version) | https://tacos.openbeta.io     | develop | Full    | [![Gitlab pipeline status](https://img.shields.io/gitlab/pipeline-status/openbeta/opentacos-content-ci?branch=develop&style=flat-square)](https://gitlab.com/openbeta/opentacos-content-ci/-/pipelines?page=1&scope=branches&ref=develop) |

## How to build

Make sure you have the following tools installed on your computer

- [Git](https://github.com/git-guides/install-git)
- [Node](https://nodejs.org)
- [npm](https://www.npmjs.com/get-npm)
- [yarn](https://classic.yarnpkg.com/en/docs/install)

1.  Download the repo to your local machine

```
git clone git@github.com:OpenBeta/open-tacos.git
```

2.  Build the code

```
cd open-tacos
git checkout nextjs
yarn install
```

4.  Run the app

```
yarn dev
```

5. Optional: Run the app in docker

Requirements: [Docker](https://docs.docker.com/get-docker/)

```
docker compose up
```

Changes in your local ./src file will be available on localhost:3000
If you install new packages you will need to rebuild the docker image with

```
docker compose up --build
```

The application is now available at `https://localhost:3000`

### Tips

1.  Overriding environment variables

Default variables are defined in [.env](./.env). You can override default values, eg. pointing the frontend to a different API_SERVER, by defining them in `.env.local`.

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
    <td align="center"><a href="https://github.com/gibboj"><img src="https://avatars.githubusercontent.com/u/2992272?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kendra Gibbons</b></sub></a><br /><a href="https://github.com/OpenBeta/open-tacos/commits?author=gibboj" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome.

## License

AGPL
