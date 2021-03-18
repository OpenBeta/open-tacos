const slugify = require("slugify");
const path = require(`path`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === "AreasJson") {
    const { createNodeField } = actions;
    createNodeField({
      node,
      name: `slug`,
      value: slugify(node.area_name),
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  // const result = await graphql(`
  //   query {
  //     allRoutesJson {
  //       edges {
  //         node {
  //           metadata {
  //             mp_route_id
  //           }
  //           fields {
  //             slug
  //           }
  //         }
  //       }
  //     }
  //   }
  // `);

  const result = await graphql(`
  query {
    allAreasJson {
      edges {
        node {
          id
          area_name
          climbs
          fields {
            slug
          }
        }
      }
    }
  }
`);

  // Iterate through each climb object and create a new page
  const { createPage } = actions;
  result.data.allAreasJson.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/sector-page.js`),
      context: {
        id: node.id,
        climbs: node.climbs,
        name: node.area_name,
        slug: node.fields.slug,
      },
    });
  });
};
