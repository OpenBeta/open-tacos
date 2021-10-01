import React from "react";
import { useStaticQuery, graphql, navigate, Link } from "gatsby";

function Climbs({ id }) {
  let allClimbingRoutes = useStaticQuery(graphql`
    query {
      allMdx(
        filter: { fields: { collection: { eq: "climbing-routes" } } }
        sort: { fields: frontmatter___metadata___legacy_id }
      ) {
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

  const list = allClimbingRoutes.allMdx.edges;

  const foundNode = list.find(
    ({ node }) => id === node.frontmatter.metadata.legacy_id
  );

  // console.log("# props", allClimbingRoutes)
  if (foundNode) {
    const { node } = foundNode;
    navigate(node.fields.slug);
  }

  return (
    <div className="mt-12">
      Climb not found. <Link className="btn btn-text" to="/">Continue</Link>
    </div>
  );
}

export default Climbs;
