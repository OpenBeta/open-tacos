// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  url: 'https://tacos.openbeta.io',
  baseUrl: '/docs/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/docs',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/'
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Home',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg'
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Tutorial'
          },
          { to: '/', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'OpenBeta Home',
            items: [
              {
                label: 'Home',
                href: 'https://openbeta.io'
              }
            ]
          },
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/'
              }
            ]
          },
          {
            title: 'OpenTacos',
            items: [
              {
                label: 'Climbing route wiki',
                href: 'https://tacos.openbeta.io'
              }
            ]
          },
          {
            title: 'GitHub',
            items: [
              {
                label: 'Climbing data',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus'
              },
              {
                label: 'GraphQL API',
                href: 'https://discordapp.com/invite/docusaurus'
              },
              {
                label: 'OpenTacos',
                href: 'https://tacos.openbeta.io'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
}

module.exports = config
