const slugify = require("slugify");
const path = require(`path`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === "Mdx") {
    const { createNodeField } = actions;
    const parent = getNode(node["parent"]);
    const nodeType = parent["sourceInstanceName"];

    if (nodeType === "climbing-routes") {
      
      // Computed on the fly based off relative path of the current file
      // climbing routes's parent id is the current directory.
      const parentId = path.dirname(parent.relativePath);
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
      //TODO: create a new field to help linking with parent area. But how??
      // createNodeField({
      //   node,
      //   name: `parent`,
      //   value: ???,
      // });
    } else if (nodeType === "area-indices") {

      // Computed on the fly based off relative path of the current file
      // If you looking at an index.md for an area the parent would be the 
      // index.md of 1 directory level up.
      // i.g. Take current path, go up one directory.
      const parentId = path.normalize(path.join(path.dirname(parent.relativePath),'..'));
      const pathId = path.dirname(parent.relativePath);
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
        pathId: node.fields.pathId
      },
    });
  }
  // result.data.allMdx.edges.forEach(({ node }) => {
  //   const climbs = await retrieveClimbs(node.fields.pathId);
  //   console.log(climbs);
  //   createPage({
  //     path: node.fields.slug,
  //     component: path.resolve(`./src/templates/leaf-area-page-md.js`),
  //     context: {
  //       legacy_id: node.frontmatter.metadata.legacy_id,
  //       // climbs: node.climbs,
  //       // name: node.area_name,
  //       slug: node.fields.slug,
  //     },
  //   });
  // });

  // Query all route .md documents
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
        slug: node.fields.slug,
      },
    });
  });
};
