import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
//import Card from "../components/ui/card";

/**
 * Templage for generating individual page for the climb
 */
export default function ClimbPage({ data }) {
  const { frontmatter, html } = data.markdownRemark;
  //const { fa, description, protection, YDS, location, route_name } = data.routesJson;
  const { route_name } = frontmatter;
  return (
    <Layout>
      <SEO keywords={[`foo`, `bar`]} title={route_name} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {/* <Card isGrid={false} parent_slug={parent_slug} {...data.routesJson} isStandalone={true}/> */}
    </Layout>
  );
}

export const query = graphql`
  query($mp_route_id: String!) {
    markdownRemark(
      frontmatter: { metadata: { legacy_id: { eq: $mp_route_id } } }
    ) {
        frontmatter {
          route_name
          fa
          metadata {
            legacy_id
          }
        }
        html
    }
  }
`;
