import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Link } from "gatsby";

//import Card from "../components/ui/card";
const shortcodes = { Link }; // Provide common components here

/**
 * Templage for generating individual page for the climb
 */
export default function ClimbPage({ data: { mdx } }) {
  const { route_name } = mdx.frontmatter;
  return (
    <Layout>
      <SEO keywords={[route_name]} title={route_name} />
      <h1 className="font-medium font-sans my-4">{route_name}</h1>
      <MDXProvider components={shortcodes}>
        <MDXRenderer frontmatter={mdx.frontmatter}>{mdx.body}</MDXRenderer>
      </MDXProvider>
      {/* <Card isGrid={false} parent_slug={parent_slug} {...data.routesJson} isStandalone={true}/> */}
    </Layout>
  );
}

//    mdx(frontmatter: { metadata: { legacy_id: { eq: $legacy_id } } }) {

export const query = graphql`
  query ($legacy_id: String!) {
    mdx(
      fields: { collection: { eq: "climbing-routes" } }
      frontmatter: { metadata: { legacy_id: { eq: $legacy_id } } }
    ) {
      id
      frontmatter {
        route_name
        metadata {
          legacy_id
        }
      }
      body
    }
  }
`;
