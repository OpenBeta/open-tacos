import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import USToc from "../components/USToC";
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
  let randomClimb = null;
  if (allClimbingRoutes.allMdx.edges.length >= 0) {
    randomClimb = allClimbingRoutes.allMdx.edges[randomIndex].node;
  }
  allClimbingRoutes = [];
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />

      <USToc />

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
