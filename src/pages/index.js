import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import heroImage from "../images/lukas-schulz-n6uOlqYPMXY-unsplash.jpg";
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
    allMdx(
          filter:{fields: { collection: { eq: "climbing-routes"}}}
        ) {
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
  const randomIndex = getRandomInt(min,max);
  const randomClimb = allClimbingRoutes.allMdx.edges[randomIndex].node;
  allClimbingRoutes = [];
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      <section className="text-center">
        <div className="relative hero-card rounded-lg h-64 overflow-hidden">
          <img
            alt="Yosemite National Park"
            className="block mx-auto mb-8 rounded-lg opacity-40 absolute -top-20"
            src={heroImage}
          />
          <div className="absolute top-20 left-10 text-left">
            <span className="font-bold text-2xl text-gray-50">OpenTacos</span>
            <h1 className="text-5xl font-bold text-gray-50">Become a <span className="font-light">Contributor</span></h1>
            <span className="text-gray-50 text-lg top-5 relative">collaborative climbing route catalog</span>
          </div>
        </div>
        <div className="flex justify-end mt-10">
          <div className="w-2/6">
            <h2 className="text-left font-light">Randomly Featured Route</h2>
            <RandomRouteCard climb={randomClimb}></RandomRouteCard>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default IndexPage;
