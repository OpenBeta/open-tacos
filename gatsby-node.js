const path = require("path");
const slugify = require("slugify");

/**
 * Converts the relativePath to a POSIX path.
 * This is to unify all paths to one structure for consistent ids
 * @param {String} relativePath
 * @returns
 */
const convertPathToPOSIX = (relativePath) => {
  return relativePath.split(path.sep).join(path.posix.sep);
};

/**
 * Remove project's content base dir (__dirname +"/content") from full path and split the rest with String.split("/").
 * The output is used for generating page slug and breadcrumbs.
 *
 * Example:
 * ```
 * pathTokenizer("/Users/bob/projects/foo/content/usa/washington/seattle/index.md")
 * => ["usa", "washington", "seattle"].
 *
 * Note that the file name 'index.md' is not included.
 * ```
 * @param {String} absolutePath
 */
const pathTokenizer = (absolutePath) => {
  return path
    .dirname(absolutePath.replace(__dirname + "/content/", ""))
    .split("/");
};

/**
 * Slugify each element of `pathTokens` and join them together.
 * ```
 * slugify_path(["USA", "This has space"]) => 'usa/this-has-space'
 * ```
 * @param {string[]} pathTokens
 */
const slugify_path = (pathTokens) => {
  return pathTokens
    .map((s) => slugify(s, { lower: true, strict: true }))
    .join("/");
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Climb implements Node {
      slug: String!
      filename: String!
      parentRawPath: String!
      pathTokens: [String!]!
      frontmatter: ClimbFrontmatter!
    }
    type ClimbFrontmatter {
      route_name: String!
      fa: String!
      yds: String
      safety: String!
      type: ClimbType! 
      metadata: ClimbMetadata!
    }
    type ClimbMetadata {
      legacy_id: String!
      left_right_index: String!
    }
    type ClimbType {
      tr: Boolean
      trad: Boolean
      sport: Boolean
      boulder: Boolean
      alpine: Boolean
      aid: Boolean
      mixed: Boolean
    }
    type Area implements Node {
      slug: String!
      filename: String!
      rawPath: String!
      pathTokens: [String!]!
      frontmatter: AreaFrontmatter!
    }
    type AreaFrontmatter {
      area_name: String
      metadata: AreaMetadata!
    }
    type AreaMetadata {
      legacy_id: String!
      lat: Float!
      lng: Float!
    }
  `;
  createTypes(typeDefs);
};

exports.onCreateNode = ({
  node,
  getNode,
  actions,
  createNodeId,
  createContentDigest,
}) => {
  if (node.internal.type !== "Mdx") return;
  const { createNode } = actions;
  const parent = getNode(node["parent"]);
  const nodeType = parent["sourceInstanceName"];
  if (nodeType !== "areas-routes") return;
  const markdownFileName = path.posix.parse(parent.relativePath).name;
  if (markdownFileName === "index") {
    // Computed on the fly based off relative path of the current file
    // If you looking at an index.md for an area the parent would be the
    // index.md of 1 directory level up.
    // i.g. Take current path, go up one directory.
    // const parentId = convertPathToPOSIX(
    //   path.join(path.dirname(parent.relativePath), "..")
    // );

    //const pathTokens = pathTokenizer(node.fileAbsolutePath);

    
    const pathId = convertPathToPOSIX(
      path.join(path.dirname(parent.relativePath))
    );
    const pathTokens = pathId.split("/");

    const slug = `/${slugify_path(pathTokens)}`;
    const fieldData = {
      slug,
      frontmatter: node.frontmatter,
      rawPath: pathId,
      filename: markdownFileName,
      pathTokens,
    };

    const areaNodeId = createNodeId(slug);
    const _parentAreaPath = pathTokens.slice(0, pathTokens.length - 1);
    createNode({
      ...fieldData,
      // Required fields
      id: areaNodeId,
      parent: node.id,
      parent_area___NODE: createNodeId(`/${slugify_path(_parentAreaPath)}`),
      children: [],
      internal: {
        type: `Area`,
        contentDigest: createContentDigest(node.internal.content),
        description: `OpenBeta area for climb`,
      },
    });
  } else {
    // Computed on the fly based off relative path of the current file
    // climbing routes's parent id is the current directory.
    const parentId = convertPathToPOSIX(
      path.join(path.dirname(parent.relativePath))
    );

    const pathTokens = parentId.split("/");

    const parentAreaId = createNodeId(`/${slugify_path(pathTokens)}`);
    pathTokens.push(markdownFileName);

    const slug = `/${slugify_path(pathTokens)}`;
    const fieldData = {
      slug,
      frontmatter: node.frontmatter,
      parentRawPath: parentId,
      filename: markdownFileName,
      pathTokens,
      area___NODE: parentAreaId,
    };

    // const parentAreaNode = getNode(parentAreaId);
    // if (!parentAreaNode) {
    //   console.log("## can't find parent ", markdownFileName, parentId);
    // } else {
    //   console.log(
    //     "# parent",
    //     parentAreaNode,
    //     markdownFileName
    //   );
    // }

    const climbNodeId = createNodeId(`${slug}-climbing-route`);

    createNode({
      ...fieldData,
      // Required fields
      id: climbNodeId,
      parent: node.id,
      children: [],
      internal: {
        type: `Climb`,
        contentDigest: createContentDigest(node.internal.content),
        description: `OpenBeta node for climb`,
      },
    });

    // const newClimbNode = getNode(climbNodeId);
    // createParentChildLink({ parent: parentAreaNode, child: newClimbNode });

    // createNodeField({
    //   node,
    //   name: `slug`,
    //   value: slug,
    // });
    // createNodeField({
    //   node,
    //   name: `filename`,
    //   value: markdownFileName,
    // });
    // createNodeField({
    //   node,
    //   name: `collection`,
    //   value: nodeType,
    // });
    // createNodeField({
    //   node,
    //   name: `parentId`,
    //   value: parentId,
    // });
    // createNodeField({
    //   node,
    //   name: `pathTokens`,
    //   value: pathTokens,
    // });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  // Query all leaf area index documents
  // var result = await graphql(`
  //   query {
  //     allMdx(filter: { fields: { collection: { eq: "area-indices" } } }) {
  //       edges {
  //         node {
  //           id
  //           fields {
  //             slug
  //             pathId
  //             parentId
  //           }
  //           frontmatter {
  //             metadata {
  //               legacy_id
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // `);

  var result = await graphql(`
    query {
      allArea {
        edges {
          node {
            id
            slug
          }
        }
      }
    }
  `);

  // For every node in "area-indices" create a parentId to child Ids look up
  // data structure
  const childAreas = {};
  // result.data.allMdx.edges.map(({ node }) => {
  //   const parentId = node.fields.parentId;
  //   const pathId = node.fields.pathId;

  //   if (childAreas[parentId]) {
  //     childAreas[parentId].push(pathId);
  //     childAreas[parentId] = [...new Set(childAreas[parentId])];
  //   } else {
  //     childAreas[parentId] = [pathId];
  //   }
  // });

  // Create each index page for each leaf area
  const { createPage } = actions;
  for (const { node } of result.data.allArea.edges) {
    // For a given area indices, list out all the possible path strings for
    // the children areas
    // const childAreaPathIds = childAreas[node.fields.pathId]
    //   ? childAreas[node.fields.pathId]
    //   : [];
    createPage({
      path: node.slug,
      component: path.resolve(`./src/templates/leaf-area-page-md.js`),
      context: {
        node_id: node.id,
        childAreaPathIds: [], //childAreaPathIds,
      },
    });
  }

  //  Query all route .md documents
  result = await graphql(`
    query {
      allClimb {
        edges {
          node {
            id
            slug
          }
        }
      }
    }
  `);

  // Create a single page for each climb
  result.data.allClimb.edges.forEach(({ node }) => {
    createPage({
      path: node.slug,
      component: path.resolve(`./src/templates/climb-page-md.js`),
      context: {
        node_id: node.id,
      },
    });
  });
};

/**
 * Webpack no longer includes path-browserify.  Adding this
 * function to make 'path' library available to client-side code.
 */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        path: require.resolve("path-browserify"),
        assert: false,
        stream: false,
      },
    },
  });
};

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;

  // Matching pages on the client side
  if (page.path.match(/^\/edit/)) {
    page.matchPath = "/edit/*";

    // Update the page
    createPage(page);
  }
};
