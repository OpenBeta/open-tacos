import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import RandomRouteCard from "../components/RandomRouteCard";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  //The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min);
}

function IndexPage() {
  let allClimbingRoutes = useStaticQuery(graphql`
    query {
      allMdx(filter: { fields: { collection: { eq: "climbing-routes" } } }) {
        edges {
          node {
            fields {
              parentId
              slug
            }
            frontmatter {
              route_name
              yds
              type {
                tr
                trad
                sport
                boulder
              }
              metadata {
                legacy_id
              }
            }
          }
        }
      }
    }
  `);
  const min = 0;
  const max = allClimbingRoutes.allMdx.edges.length;
  const randomIndex = getRandomInt(min, max);
  const randomClimb = allClimbingRoutes.allMdx.edges[randomIndex].node;
  allClimbingRoutes = [];
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      <h4 className="text-xl font-medium my-4">Explore by States</h4>
      <div class="flex gap-x-4">
        <div className="text-gray-400">California</div>
        <div>
          <Link to="/areas/2c278fe6-c679-4aef-a6e1-085d9d205bab/nevada">
            Nevada
          </Link>
        </div>
        <div>
          <Link to="/areas/e69f6a6f-ddb1-4460-89c6-024b110c89a7/oregon">
            Oregon
          </Link>
        </div>
      </div>

      <h2 className="text-xl font-medium mt-12 mb-4">
        Randomly Featured Route
      </h2>
      <div className="flex">
        <div className="w-2/6">
          <RandomRouteCard climb={randomClimb}></RandomRouteCard>
        </div>
      </div>
    </Layout>
  );
}

export default IndexPage;
