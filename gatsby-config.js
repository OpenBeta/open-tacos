const resolveConfig = require("tailwindcss/resolveConfig");
const tailwindConfig = require("./tailwind.config.js");
const fullConfig = resolveConfig(tailwindConfig);

module.exports = {
  siteMetadata: {
    title: `OpenTacos`,
    description: `Open collaboration climbing platform`,
    author: `hello@openbeta.io`,
  },
  flags: {
    PRESERVE_WEBPACK_CACHE: true,
    FAST_DEV: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
    PARALLEL_SOURCING: true
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `openbeta-rock-climbing-platform`,
        short_name: `Open source rock climbing platform`,
        start_url: `/`,
        background_color: fullConfig.theme.colors.white,
        theme_color: fullConfig.theme.colors.green["500"],
        display: `minimal-ui`,
        icon: `src/assets/icons/taco.svg`,
      },
    },
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [
          require(`tailwindcss`)(tailwindConfig),
          require(`autoprefixer`),
          ...(process.env.NODE_ENV === `production`
            ? [require(`cssnano`)]
            : []),
        ],
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `climbing-routes`,
        path: `${__dirname}/content`,
        ignore: [`**/\.*`, `**/index\.md`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `area-indices`,
        path: `${__dirname}/content/`,
        ignore: [`**/^((?!index\.md))*$`], // A hack to include only index.md
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
        ignore: [`**/\.*`], // Ignore file starting with dot
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        defaultLayouts: {
          pages: require.resolve("./src/components/StandardPageLayout.js"),
        },
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/,
        },
      },
    },
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        custom: {
          families: ["ISO"],
          urls: ["/fonts/fonts.css"],
        },
      },
    },
    `gatsby-plugin-offline`,
  ],
};
