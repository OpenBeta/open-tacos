import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { Link } from "gatsby";

function USToC() {
  const states = useStaticQuery(graphql`
    query myquery {
      allMdx(
        filter: {
          fields: {
            collection: { eq: "area-indices" }
            parentId: { eq: "USA" }
          }
        }
        sort: { fields: frontmatter___area_name }
      ) {
        edges {
          node {
            frontmatter {
              area_name
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  return (
    <section>
      <h4 className="text-xl font-medium my-4">Explore by State</h4>
      <div className="flex space-x-4">
        {states.allMdx.edges.map(({ node }) => {
          const { frontmatter, fields } = node;
          const { slug } = fields;
          return (
            <div key={slug}>
              <State area_name={frontmatter.area_name} slug={slug} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function State({ area_name, slug }) {
  return <Link to={slug}>{area_name}</Link>;
}

export default USToC;
