const slugify = require("slugify");
const path = require(`path`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  // areas.json file -> 'AreasJson'
  // if (node.internal.type === "MarkdownRemark") {
  //   const { createNodeField } = actions;
  //   console.log(node)
  //   // createNodeField({
  //   //   node,
  //   //   name: `slug`,
  //   //   value: `areas/${node.id}/${slugify(node.area_name, { lower: true })}`,
  //   // });
  // }
  if (node.internal.type === "MarkdownRemark") {
    const { createNodeField } = actions;
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
    //   createNodeField({
    //     node,
    //     name: `parent_slug`,
    //     value: `/areas/${node.metadata.mp_sector_id}/${slugify(node.metadata.parent_sector, {
    //       lower: true,
    //     })}`,
    //   });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  // var result = await graphql(`
  //   query {
  //     allAreasJson {
  //       edges {
  //         node {
  //           id
  //           area_name
  //           climbs
  //           fields {
  //             slug
  //           }
  //         }
  //       }
  //     }
  //   }
  // `);
  // Iterate through each climb area and create a new page
  const { createPage } = actions;
  // result.data.allAreasJson.edges.forEach(({ node }) => {
  //   createPage({
  //     path: node.fields.slug,
  //     component: path.resolve(`./src/templates/sector-page.js`),
  //     context: {
  //       id: node.id,
  //       climbs: node.climbs,
  //       name: node.area_name,
  //       slug: node.fields.slug,
  //     },
  //   });
  // });
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              metadata {
                legacy_id
              }
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);
  //Create a single page for each climb
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/climb-page-md.js`),
      context: {
        mp_route_id: node.frontmatter.metadata.legacy_id,
        slug: node.fields.slug,
      },
    });
  });
};
