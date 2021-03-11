var slugify = require("slugify");

exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === "RoutesJson") {
    const { createNodeField } = actions;
    createNodeField({
      node,
      name: `slug`,
      value: slugify(node.route_name),
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const result = await graphql(`
    query {
      allRoutesJson {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);
  // Iterate through each climb object and create a new page
  result.data.allRoutesJson.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/climb-page.js`),
      context: {
        //mp_route_id: node.metadata.mp_route_id,
        slug: node.fields.slug,
      },
    });
  });
};
