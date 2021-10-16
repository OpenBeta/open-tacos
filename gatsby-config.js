if (process.env.STAGING === "true") {
  require("dotenv").config({
    path: `.env.staging`,
  });
} else {
  require("dotenv").config({
    path: `.env.production`,
  });
}

console.log(
  "$",
  process.env.PARALLEL_QUERY_RUNNING,
  process.env.NODE_ENV,
  process.env.PARALLEL_QUERY_RUNNING === "true"
);
module.exports = {
  siteMetadata: {
    title: `OpenTacos`,
    description: `Open collaboration climbing platform`,
    author: `hello@openbeta.io`,
    content_edit_branch: `edit-test`,
  },
  flags: {
    FAST_DEV: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
    PARALLEL_SOURCING: true,
    PARALLEL_QUERY_RUNNING: process.env.PARALLEL_QUERY_RUNNING === "true",
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `openbeta-rock-climbing-platform`,
        short_name: `Open source rock climbing platform`,
        start_url: `/`,
        display: `minimal-ui`,
        icon: `src/assets/icons/taco.svg`,
      },
    },
    `gatsby-plugin-postcss`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `areas-routes`,
        path: `${__dirname}/content`,
        ignore: [`**/\.*`],
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
