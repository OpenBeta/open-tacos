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
  if (node.internal.type === "Mdx") {
    const { createNodeField, createNode, createParentChildLink } = actions;
    const parent = getNode(node["parent"]);
    //console.log(parent['sourceInstanceName'])
    nodeType = parent["sourceInstanceName"];
    if (nodeType === "climbing-routes") {
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
    } else if (nodeType === "area-indices") {
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
    }
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
      allMdx(filter: {fields: {collection: {eq: "climbing-routes"}}}) {
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
  console.log(result);
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
