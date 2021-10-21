if (process.env.STAGING === "true") {
  require("dotenv").config({
    path: `.env.staging`,
  });
} else {
  require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
  });
}

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
    LMDB_STORE: process.env.LMDB_STORE === "true",
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
        name: `areas-routes-wa`,
        path: `${__dirname}/content`,
        ignore: [`**/Nevada`, `**/Oregon`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `areas-routes-or`,
        path: `${__dirname}/content`,
        ignore: [`**/Washington`, `**/Nevada`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `areas-routes-nv`,
        path: `${__dirname}/content`,
        ignore: [`**/Washington`, `**/Oregon`],
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
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 850,
              quality: 80,
              showCaptions: true,
              linkImagesToOriginal: true,
            },
          },
        ],
      },
    }, // {
    //   resolve: `gatsby-plugin-mdx`,
    //   options: {
    //     extensions: [`.mdx`, `.md`],
    //     defaultLayouts: {
    //       pages: require.resolve("./src/components/StandardPageLayout.js"),
    //     },
    //     gatsbyRemarkPlugins: [
    //       {
    //         resolve: "gatsby-remark-images",
    //         options: {
    //           maxWidth: 850,
    //           quality: 80,
    //           showCaptions: true,
    //           linkImagesToOriginal: true,
    //         },
    //       },
    //     ],
    //   },
    // },
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
    // `gatsby-plugin-offline`,
  ],
};
