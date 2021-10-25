const path = require("path");
const slugify = require("slugify");
const { createFilePath } = require(`gatsby-source-filesystem`);

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
const slugify_path = (pathTokens) =>
  pathTokens.map((s) => slugify(s, { lower: true, strict: true })).join("/");

/**
 * Remove leading (6), (aa) or '04-' from an area or climb name.
 * @param {String} s
 */
const sanitize_name = (s) =>
  s.replace(/^(\(.{1,3}\) *)|((\d?[1-9]|[1-9]0)-)/, "");

// exports.createSchemaCustomization = ({ actions }) => {
//   const { createTypes } = actions;
//   const typeDefs = `

//     union MdFrontmatter = BaseMdFrontmatter | ClimbFrontmatter | AreaFrontmatter

//     type BaseMdFrontmatter {
//       title: String
//     }

//     type MarkdownRemark implements Node @dontInfer {
//       id: ID!
//       frontmatter: MdFrontmatter!
//       children: [Node!]!

//       excerpt(
//          format: MarkdownExcerptFormats = PLAIN
//          pruneLength: Int = 140
//          truncate: Boolean = false
//       ): String

//       rawMarkdownBody: String
//       fileAbsolutePath: String
//       html: String
//       htmlAst: JSON
//       excerptAst(
//         pruneLength: Int = 140
//         truncate: Boolean = false
//       ): JSON
//       headings(depth: MarkdownHeadingLevels): [MarkdownHeading]
//       timeToRead: Int
//       tableOfContents(
//         absolute: Boolean = false
//         heading: String
//         maxDepth: Int
//         pathToSlugField: String = ""
//       ): String
//       wordCount: MarkdownWordCount
//       parent: Node
//       internal: Internal!
//     }

//     type Climb implements Node @dontInfer {
//       id: ID!
//       slug: String!
//       filename: String!
//       rawPath: String!
//       pathTokens: [String!]!
//       frontmatter: ClimbFrontmatter!
//       parent: Node!
//       children: [Node]!
//       internal: Internal!
//     }
//     type ClimbFrontmatter {
//       route_name: String!
//       fa: String
//       yds: String!
//       safety: String!
//       type: ClimbType!
//       metadata: ClimbMetadata!
//     }
//     type ClimbMetadata {
//       legacy_id: String!
//       left_right_index: String!
//     }
//     type ClimbType {
//       tr: Boolean
//       trad: Boolean
//       sport: Boolean
//       boulder: Boolean
//       alpine: Boolean
//       aid: Boolean
//       mixed: Boolean
//     }
//     type Area implements Node @dontInfer {
//       slug: String!
//       filename: String!
//       rawPath: String!
//       pathTokens: [String!]!
//       frontmatter: AreaFrontmatter!
//       id: ID!
//       parent: Node!
//       children: [Node]!
//       internal: Internal!
//     }
//     type AreaFrontmatter {
//       area_name: String
//       metadata: AreaMetadata!
//     }
//     type AreaMetadata {
//       legacy_id: String!
//       lat: Float!
//       lng: Float!
//     }
//   `;
//   createTypes(typeDefs);
// };

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
  if (node.internal.type !== "MarkdownRemark") return;

  // Mdx plugin creates a child node for each .md/mdx file
  // with the parent node being the file node
  // ie: [File node] -> [Mdx node]
  // Use File node to get information about the underlying file,
  // Mdx node for markdown content.

  const fileNode = getNode(node["parent"]);
  const { createNode, createNodeField } = actions;

  if (fileNode["sourceInstanceName"] === "regular-md") {
    const relativeFilePath = createFilePath({
      node,
      getNode,
    });
    createNodeField({
      node,
      name: `slug`,
      value: `/${slugify(relativeFilePath, { lower: true, strict: true })}`,
    });
    return;
  }
  if (!fileNode["sourceInstanceName"].startsWith("areas-routes")) return;

  const rawPath = convertPathToPOSIX(fileNode.relativeDirectory);
  const markdownFileName = fileNode.name; // filename without extension
  // index.md: special file describing the area
  // Create an Area node [File node] -> [Mdx node] -> [Area node]
  if (markdownFileName === "index") {
    const pathTokens = rawPath.split("/");
    const areaNodeId = createNodeId(pathTokens.join("-"));
    const slug = `/${slugify_path(pathTokens)}`;

    const fieldData = {
      slug,
      frontmatter: {
        ...node.frontmatter,
        area_name: sanitize_name(node.frontmatter.area_name),
      },
      rawPath,
      filename: markdownFileName,
      pathTokens,
    };

    // Calculate parent area by going up 1 level, ie. dropping the last elment.
    // [] parent means this has no parent. It's a Country node.
    // const _parentAreaPath = pathTokens.slice(0, pathTokens.length - 1);

    createNode({
      ...fieldData,
      // Required fields
      id: areaNodeId,
      parent: node.id,
      // parent_area___NODE:
      //   _parentAreaPath.length === 0
      //     ? null // no parent
      //     : createNodeId(_parentAreaPath.join("-")),
      children: [],
      internal: {
        type: `Area`,
        contentDigest: createContentDigest(node.internal.content),
        description: `OpenBeta area for climb`,
      },
    });
  } else {
    // Sample data:
    // - rawPath: /USA/Oregon/Portland/Broughton Bluff/Hanging Gardens
    // - markdownFileName: giants-staircase (without .md)
    // Derived data:
    //  - pathTokens: ["USA", "Oregon", "Portland", "Broughton Bluff", "Hanging Gardens"]
    //  - slug: /usa-oregon-portland-broughton-bluff-hanging-gardens-giants-staircase
    //  -  parentAreaId = <some uuid generated from rawPath>
    //      (we use the parent Id as a way to link this Climb node with Area node)

    const rawPath = convertPathToPOSIX(fileNode.relativeDirectory);
    const pathTokens = rawPath.split("/");
    // const parentAreaId = createNodeId(pathTokens.join("-"));
    // include the climb.md file name (without .md)
    pathTokens.push(markdownFileName);

    const slug = `/${slugify_path(pathTokens)}`;

    const fieldData = {
      slug,
      frontmatter: {
        ...node.frontmatter,
        yds: `${node.frontmatter.yds}`,
        route_name: sanitize_name(node.frontmatter.route_name),
      },
      rawPath,
      filename: markdownFileName,
      pathTokens,
      // area___NODE: parentAreaId,
    };

    createNode({
      ...fieldData,
      // Required fields
      id: createNodeId(pathTokens.join("-")),
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

exports.createPages = async ({ graphql, actions, getNode, createNodeId }) => {
  var result = await graphql(`
    query {
      allArea(sort: { fields: frontmatter___area_name }) {
        edges {
          node {
            id
            slug
            pathTokens
          }
        }
      }
    }
  `);

  // Create an index page for each area
  const { createPage, createParentChildLink } = actions;
  result.data.allArea.edges.forEach(({ node }) => {
    const _parentAreaPath = node.pathTokens.slice(
      0,
      node.pathTokens.length - 1
    );

    const parent_area_node =
      _parentAreaPath.length === 0
        ? null // no parent
        : getNode(createNodeId(_parentAreaPath.join("-")));

    // Add children areas here instead of onCreateNode() because
    // gatsby-filesystem-plugin process Mdx files in a random order;
    // sometimes child areas are created before the parent.
    if (parent_area_node) {
      createParentChildLink({
        parent: parent_area_node,
        child: node,
      });
    }

    createPage({
      path: node.slug,
      component: path.resolve(`./src/templates/leaf-area-page-md.js`),
      context: {
        node_id: node.id,
      },
    });
  });

  //  Query all route .md documents
  var result = await graphql(`
    query {
      allClimb(sort: { fields: rawPath }) {
        edges {
          node {
            id
            slug
            rawPath
            pathTokens
          }
        }
      }
    }
  `);

  // Create a single page for each climb
  result.data.allClimb.edges.forEach(({ node }) => {
    const _parentAreaPath = node.pathTokens.slice(
      0,
      node.pathTokens.length - 1
    );
    const parentArea = getNode(createNodeId(_parentAreaPath.join("-")));
    if (parentArea) {
      createParentChildLink({
        parent: parentArea,
        child: node,
      });
    } else {
      console.log("# without area ", node);
    }
    createPage({
      path: node.slug,
      component: path.resolve(`./src/templates/climb-page-md.js`),
      context: {
        node_id: node.id,
      },
    });
  });

  //  Query all route .md documents
  var result = await graphql(`
    query {
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/.*pages/" } }) {
        edges {
          node {
            id
            fields {
              slug
            }
          }
        }
      }
    }
  `);
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/general-page-md.js`),
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
