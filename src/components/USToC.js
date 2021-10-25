import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { Link } from "gatsby";

function USToC() {
  const states = useStaticQuery(graphql`
    query myquery {
      allArea(
        filter: { rawPath: {regex: "/^USA\/[a-zA-Z\\s]+[^\/]$/" }}
        sort: { fields: frontmatter___area_name }
      ) {
        edges {
          node {
            frontmatter {
              area_name
            }
            slug
          }
        }
      }
    }
  `);

  return (
    <section>
      <h2 className="text-xl font-bold mt-6">Explore by State</h2>
      <div className="flex space-x-4">
        {states.allArea.edges.map(({ node }) => {
          const { frontmatter, slug } = node;
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
