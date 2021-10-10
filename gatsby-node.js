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

exports.onCreateNode = ({
  node,
  getNode,
  actions,
  createNodeId,
  createContentDigest,
}) => {
  if (node.internal.type === "Mdx") {
    const { createNodeField, createNode } = actions;
    const parent = getNode(node["parent"]);
    const nodeType = parent["sourceInstanceName"];
    const markdownFileName = path.posix.parse(parent.relativePath).name;
    if (nodeType === "climbing-routes") {
      // Computed on the fly based off relative path of the current file
      // climbing routes's parent id is the current directory.
      const parentId = convertPathToPOSIX(
        path.join(path.dirname(parent.relativePath))
      );
      const pathTokens = pathTokenizer(node.fileAbsolutePath);

      const parentAreaId = createNodeId(`/${slugify_path(pathTokens)}`);
      console.log("# parent id", parentAreaId);
      pathTokens.push(markdownFileName);

      const slug = `/${slugify_path(pathTokens)}`;
      const fieldData = {
        slug,
        frontmatter: node.frontmatter,
        area___NODE: parentAreaId,
      };

      const climbNodeId = createNodeId(slug);

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

      createNodeField({
        node,
        name: `slug`,
        value: slug,
      });
      createNodeField({
        node,
        name: `filename`,
        value: markdownFileName,
      });
      createNodeField({
        node,
        name: `collection`,
        value: nodeType,
      });
      createNodeField({
        node,
        name: `parentId`,
        value: parentId,
      });
      createNodeField({
        node,
        name: `pathTokens`,
        value: pathTokens,
      });
    } else if (nodeType === "area-indices") {
      // Computed on the fly based off relative path of the current file
      // If you looking at an index.md for an area the parent would be the
      // index.md of 1 directory level up.
      // i.g. Take current path, go up one directory.
      const parentId = convertPathToPOSIX(
        path.join(path.dirname(parent.relativePath), "..")
      );

      const pathTokens = pathTokenizer(node.fileAbsolutePath);

      const pathId = convertPathToPOSIX(
        path.join(path.dirname(parent.relativePath))
      );

      const slug = `/${slugify_path(pathTokens)}`;

      const fieldData = {
        slug,
        frontmatter: node.frontmatter,
      };

      const areaNodeId = createNodeId(slug);

      createNode({
        ...fieldData,
        // Required fields
        id: areaNodeId,
        parent: node.id,
        children: [],
        internal: {
          type: `Area`,
          contentDigest: createContentDigest(node.internal.content),
          description: `OpenBeta area for climb`,
        },
      });

      createNodeField({
        node,
        name: `slug`,
        value: slug,
      });
      createNodeField({
        node,
        name: `filename`,
        value: markdownFileName,
      });
      createNodeField({
        node,
        name: `collection`,
        value: nodeType,
      });
      createNodeField({
        node,
        name: `parentId`,
        value: parentId,
      });
      createNodeField({
        node,
        name: `pathId`,
        value: pathId,
      });
      createNodeField({
        node,
        name: `pathTokens`,
        value: pathTokens,
      });
    }
  }
};

exports.createPages = async ({ graphql, actions }) => {
  // Query all leaf area index documents
  var result = await graphql(`
    query {
      allMdx(filter: { fields: { collection: { eq: "area-indices" } } }) {
        edges {
          node {
            fields {
              slug
              pathId
              parentId
            }
            frontmatter {
              metadata {
                legacy_id
              }
            }
          }
        }
      }
    }
  `);

  // For every node in "area-indices" create a parentId to child Ids look up
  // data structure
  const childAreas = {};
  result.data.allMdx.edges.map(({ node }) => {
    const parentId = node.fields.parentId;
    const pathId = node.fields.pathId;

    if (childAreas[parentId]) {
      childAreas[parentId].push(pathId);
      childAreas[parentId] = [...new Set(childAreas[parentId])];
    } else {
      childAreas[parentId] = [pathId];
    }
  });

  // Create each index page for each leaf area
  const { createPage } = actions;
  for (const { node } of result.data.allMdx.edges) {
    // For a given area indices, list out all the possible path strings for
    // the children areas
    const childAreaPathIds = childAreas[node.fields.pathId]
      ? childAreas[node.fields.pathId]
      : [];
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/leaf-area-page-md.js`),
      context: {
        legacy_id: node.frontmatter.metadata.legacy_id,
        pathId: node.fields.pathId,
        childAreaPathIds: childAreaPathIds,
      },
    });
  }

  //  Query all route .md documents
  result = await graphql(`
    query {
      allMdx(filter: { fields: { collection: { eq: "climbing-routes" } } }) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              metadata {
                legacy_id
              }
            }
          }
        }
      }
    }
  `);

  // Create a single page for each climb
  result.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/climb-page-md.js`),
      context: {
        legacy_id: node.frontmatter.metadata.legacy_id,
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
