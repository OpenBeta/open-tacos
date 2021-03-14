import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
const slugify = require("slugify");

import Layout from "../components/layout";
import SEO from "../components/seo";
import Card from "../components/ui/card";

export default function SectorPage({ data, pageContext }) {
  //console.log(pageContext, data);
  const { name } = pageContext;
  return (
    <Layout>
      <SEO keywords={[`foo`, `bar`]} title="About" />
      <h1 className="text-2xl font-medium font-sans">{name}</h1>
      {data.allRoutesJson.edges.map(({ node }) => (
        <div
          className="pt-12"
          id={slugify(node.route_name)}
          key={node.metadata.mp_route_id}
        >
          <Card {...node} />
        </div>
      ))}
    </Layout>
  );
}

SectorPage.propTypes = {
  data: PropTypes.object,
  pageContext: PropTypes.object,
};
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
