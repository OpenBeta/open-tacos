import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Link } from "gatsby";
import RouteCard from "../components/ui/RouteCard";

const shortcodes = { Link };

/**
 * Templage for generating individual page for the climb
 */
export default function LeafAreaPage({ data }) {
  const {mdx, climbs} = data;
  const { area_name } = mdx.frontmatter;
  console.log(data);
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
  query ($legacy_id: String!, $pathId: String) {
    mdx: mdx(
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
    climbs: allMdx(
      filter:{fields:{collection:{eq:"climbing-routes"}, parentId:{eq:$pathId}}}
    ) {
 			totalCount
      edges {
				node {
            fields {
   						parentId
            }
            frontmatter {
              route_name
            }
          }
      }
    }
  }
`;
