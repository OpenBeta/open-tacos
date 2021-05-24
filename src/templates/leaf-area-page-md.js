import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Link } from "gatsby";

const shortcodes = { Link };

/**
 * Templage for generating individual page for the climb
 */
export default function LeafAreaPage({ data: { mdx } }) {
  const { area_name } = mdx.frontmatter;
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO keywords={[area_name]} title={area_name} />
      <h1 className="text-lg font-bold font-sans my-4">{area_name}</h1>
      <MDXProvider components={shortcodes}>
        <MDXRenderer frontmatter={mdx.frontmatter}>{mdx.body}</MDXRenderer>
      </MDXProvider>
    </Layout>
  );
}

export const query = graphql`
  query ($legacy_id: String!) {
    mdx(
      fields: { collection: { eq: "area-indices" } }
      frontmatter: { metadata: { legacy_id: { eq: $legacy_id } } }
    ) {
      id
      frontmatter {
        area_name
        metadata {
          legacy_id
          lng
          lat
        }
      }
      body
    }
  }
`;
