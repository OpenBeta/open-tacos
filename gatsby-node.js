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
 * Slugify each element of `pathTokens` and join them together.
 * ```
 * slugify_path(["USA", "Oregon", "This has space"]) => 'usa/oregon/this-has-space'
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
      rawPath: String!
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

/**
 * This is Gatsby's special callback that allows us to extend the existing data
 * structure representing each .md file.
 * The main purpose of this function is to create an 'Area' node for each index.md and 'Climb' nodes for other .md files.
 */
exports.onCreateNode = ({
  node,
  getNode,
  actions,
  createNodeId,
  createContentDigest,
}) => {
  if (node.internal.type !== "Mdx") return;

  // Mdx plugin creates a child node for each .md/mdx file
  // with the parent node being the file node
  // ie: [File node] -> [Mdx node]
  // Use File node to get information about the underlying file,
  // Mdx node for markdown content.

  const fileNode = getNode(node["parent"]);
  if (fileNode["sourceInstanceName"] !== "areas-routes") return;

  const { createNode } = actions;
  const rawPath = convertPathToPOSIX(fileNode.relativeDirectory);
  const markdownFileName = fileNode.name;
  // index.md: special file describing the area
  // Create an Area node [File node] -> [Mdx node] -> [Area node]
  if (markdownFileName === "index") {
    const pathTokens = rawPath.split("/");
    const slug = `/${slugify_path(pathTokens)}`;

    const fieldData = {
      slug,
      frontmatter: node.frontmatter,
      rawPath,
      filename: markdownFileName,
      pathTokens,
    };

    // Calculate parent area by going up 1 level
    const _parentAreaPath =
      pathTokens.length === 1
        ? null
        : pathTokens.slice(0, pathTokens.length - 1);

    createNode({
      ...fieldData,
      // Required fields
      id: createNodeId(slug),
      parent: node.id,
      parent_area___NODE: _parentAreaPath ? createNodeId(`/${slugify_path(_parentAreaPath)}`): null,
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
    const rawPath = convertPathToPOSIX(fileNode.relativeDirectory);
    const pathTokens = rawPath.split("/");

    const parentAreaId = createNodeId(`/${slugify_path(pathTokens)}`);
    pathTokens.push(markdownFileName);

    const slug = `/${slugify_path(pathTokens)}`;
    const fieldData = {
      slug,
      frontmatter: node.frontmatter,
      rawPath,
      filename: markdownFileName,
      pathTokens,
      area___NODE: parentAreaId,
    };

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
  }
};

exports.createPages = async ({ graphql, actions }) => {
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

  // Create each index page for each area
  const { createPage } = actions;
  result.data.allArea.edges.forEach(({ node }) => {
    createPage({
      path: node.slug,
      component: path.resolve(`./src/templates/leaf-area-page-md.js`),
      context: {
        node_id: node.id,
      },
    });
  });

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
