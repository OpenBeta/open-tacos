const slugify = require("slugify");
const path = require(`path`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  // areas.json file -> 'AreasJson'
  if (node.internal.type === "AreasJson") {
    const { createNodeField } = actions;
    createNodeField({
      node,
      name: `slug`,
      value: `areas/${node.id}/${slugify(node.area_name, { lower: true })}`,
    });
  }
  if (node.internal.type === "RoutesJson") {
    const { createNodeField } = actions;
    createNodeField({
      node,
      name: `slug`,
      value: `climbs/${node.metadata.mp_route_id}/${slugify(node.route_name, {
        lower: true,
      })}`,
    });
    createNodeField({
      node,
      name: `parent_slug`,
      value: `/areas/${node.metadata.mp_sector_id}/${slugify(node.metadata.parent_sector, {
        lower: true,
      })}`,
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

  var result = await graphql(`
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

  // Iterate through each climb area and create a new page
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

  result = await graphql(`
    query {
      allRoutesJson {
        edges {
          node {
            metadata {
              mp_route_id
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);

    // Create a new page for each climb
    result.data.allRoutesJson.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve(`./src/templates/climb-page.js`),
        context: {
          mp_route_id: node.metadata.mp_route_id,
          slug: node.fields.slug,
        },
      });
    });
};
