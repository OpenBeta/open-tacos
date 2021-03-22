import React, { useState } from "react";
import { graphql } from "gatsby";
const slugify = require("slugify");

import Layout from "../components/layout";
import SEO from "../components/seo";
import Card from "../components/ui/card";
import GradeDistribution from "../components/GradeDistribution";
import { IconButton } from "../components/ui/Button";
import GridIcon from "../assets/icons/grid.svg";
import ListIcon from "../assets/icons/list.svg";


export default function SectorPage({ data, pageContext }) {
  const [gridView, setGridView] = useState(true);
  //console.log(pageContext, data);
  const { name } = pageContext;
  return (
    <Layout>
      <SEO keywords={[`foo`, `bar`]} title={name} />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medium font-sans">{name}</h1>

      </div>

      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="md:flex-1 text-sm text-gray-700 mt-4">
          Kale chips live-edge elit excepteur, hashtag waistcoat chillwave velit
          disrupt franzen qui snackwave anim bitters. You probably haven&apos;t heard
          of them duis minim brooklyn quinoa adipisicing cupidatat hexagon et
          live-edge wayfarers consequat synth af. Banh mi occupy nostrud,
          messenger bag succulents knausgaard meh.
        </div>
        <div className="md:flex-1"></div>
      </div>

      <div className="mt-6 mb-2 flex justify-center"><GradeDistribution/></div>

      <div className="flex justify-end">
          <IconButton onClick={() => setGridView(true)} className="mr-2">
            <GridIcon
              className={
                gridView
                  ? "fill-current text-green-700 w-6 h-6 animate-pulse"
                  : "fill-current text-gray-400 w-6 h-6"
              }
            />
          </IconButton>
          <IconButton onClick={() => setGridView(false)}>
            <ListIcon
              className={
                !gridView
                  ? "fill-current text-green-700 w-6 h-6 animate-pulse"
                  : "fill-current text-gray-400 w-6 h-6"
              }
            />
          </IconButton>
        </div>

      <div className={gridView ? "grid grid-cols-3 gap-x-3" : ""}>
        {data.allRoutesJson.edges.map(({ node }) => (
          <div
            className={`pt-6 ${gridView ? "max-h-96" : ""}`}
            id={slugify(node.route_name)}
            key={node.metadata.mp_route_id}
          >
            <Card isGrid={gridView} {...node} />
          </div>
        ))}
      </div>
    </Layout>
  );
}

/* export const query = graphql`
  query($id: String!) {
    areasJson(id: { eq: $id }) {
      id
      area_name
      climbs
      lnglat
    }
  }
`; */

export const query = graphql`
  query($climbs: [String!]) {
    allRoutesJson(filter: { metadata: { mp_route_id: { in: $climbs } } }) {
      edges {
        node {
          route_name
          fa
          YDS
          description
          location
          protection
          safety
          type {
            trad
            tr
            aid
            boulder
            sport
            ice
            alpine
            mixed
            snow
          }
          metadata {
            mp_route_id
          }
        }
      }
    }
  }
`;
