const slugify = require("slugify");
const path = require(`path`);

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
 * This will take a path 
 * i.g. USA/Nevada/Southern Nevada/Red Rock/16-Black Velvet Canyon/Black Velvet Wall
 * and split it into all possible paths
 * USA/Nevada/Southern Nevada/Red Rock/16-Black Velvet Canyon/Black Velvet Wall
 * USA/Nevada/Southern Nevada/Red Rock/16-Black Velvet Canyon/
 * USA/Nevada/Southern Nevada/Red Rock/
 * USA/Nevada/Southern Nevada/
 * etc...
 * 
 * @param {String} pathId is a POSIX path with / delimiters
 * @returns {Array} returns all the possible paths. The highest root level
 * path will be the first element in the array i.g. ["USA","USA/Nevada",etc...]
 */
const pathIdToAllPossibleParentPaths = (pathId) => {
  const allPossiblePaths = [];
  const splitPathId = pathId.split('/');
  const totalNumberOfPossiblePaths = splitPathId.length;

  let runningPath = [];
  for(let index = 0; index < totalNumberOfPossiblePaths; index++) {
    let currentPath = splitPathId[index];
    runningPath.push(currentPath);
    allPossiblePaths.push(runningPath.join('/'));
  }
  
  return allPossiblePaths;
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === "Mdx") {
    const { createNodeField } = actions;
    const parent = getNode(node["parent"]);
    const nodeType = parent["sourceInstanceName"];

    if (nodeType === "climbing-routes") {
      
      // Computed on the fly based off relative path of the current file
      // climbing routes's parent id is the current directory.
      const parentId = convertPathToPOSIX(path.join(path.dirname(parent.relativePath)));
      const possibleParentPaths = pathIdToAllPossibleParentPaths(parentId);
      createNodeField({
        node,
        name: `slug`,
        value: `climbs/${node.frontmatter.metadata.legacy_id}/${slugify(
          node.frontmatter.route_name,
          {
            lower: true,
          }
        )}`,
      });
      createNodeField({
        node,
        name: `collection`,
        value: nodeType,
      });
      createNodeField({
        node,
        name: `parentId`,
        value: parentId
      })
      createNodeField({
        node,
        name: `possibleParentPaths`,
        value: possibleParentPaths
      });
    } else if (nodeType === "area-indices") {

      // Computed on the fly based off relative path of the current file
      // If you looking at an index.md for an area the parent would be the 
      // index.md of 1 directory level up.
      // i.g. Take current path, go up one directory.
      const parentId = convertPathToPOSIX(path.join(path.dirname(parent.relativePath),'..'));
      const pathId = convertPathToPOSIX(path.join(path.dirname(parent.relativePath)));
      const possibleParentPaths = pathIdToAllPossibleParentPaths(parentId);
      createNodeField({
        node,
        name: `slug`,
        value: `/areas/${node.frontmatter.metadata.legacy_id}/${slugify(
          node.frontmatter.area_name,
          {
            lower: true,
          }
        )}`,
      });
      createNodeField({
        node,
        name: `collection`,
        value: nodeType,
      });
      createNodeField({
        node,
        name: `parentId`,
        value: parentId
      });
      createNodeField({
        node,
        name: `pathId`,
        value: pathId
      });
      createNodeField({
        node,
        name: `possibleParentPaths`,
        value: possibleParentPaths
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
              possibleParentPaths
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
  // Create each index page for each leaf area
  const { createPage } = actions;
  for (const {node} of result.data.allMdx.edges) {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/leaf-area-page-md.js`),
      context: {
        legacy_id: node.frontmatter.metadata.legacy_id,
        // climbs: node.climbs,
        // name: node.area_name,
        slug: node.fields.slug,
        pathId: node.fields.pathId,
        possibleParentPaths: node.fields.possibleParentPaths
      },
    });
  }

  // Query all route .md documents
  result = await graphql(`
    query {
      allMdx(filter: { fields: { collection: { eq: "climbing-routes" } } }) {
        edges {
          node {
            fields {
              slug
              parentId
              possibleParentPaths
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
        slug: node.fields.slug,
        parentId: node.fields.parentId,
        possibleParentPaths: node.fields.possibleParentPaths
      },
    });
  });
};
