import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Link } from "gatsby";
import BreadCrumbs from "../components/ui/BreadCrumbs";
import {createNavigatePaths, pathOrParentIdToGitHubLink} from "../js/utils";
import LinkToGithub from "../components/ui/LinkToGithub";

const shortcodes = { Link }; // Provide common components here

/**
 * Templage for generating individual page for the climb
 */
export default function ClimbPage({ data: { mdx, parentAreas } }) {
  const { route_name } = mdx.frontmatter;
  const {parentId, filename} = mdx.fields;
  const navigationPaths = createNavigatePaths(parentId, parentAreas.edges);
  const githubLink = pathOrParentIdToGitHubLink(parentId, filename);
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO keywords={[route_name]} title={route_name} />
      <BreadCrumbs path={parentId} navigationPaths={navigationPaths}></BreadCrumbs>
      <h1 className="font-medium font-sans my-4">{route_name}</h1>
      <MDXProvider components={shortcodes}>
        <MDXRenderer frontmatter={mdx.frontmatter}>{mdx.body}</MDXRenderer>
      </MDXProvider>
      <LinkToGithub link={githubLink} docType="climb"></LinkToGithub>
    </Layout>
  );
}

export const query = graphql`
  query ($legacy_id: String!,  $possibleParentPaths: [String]) {
    mdx: mdx(
      fields: { collection: { eq: "climbing-routes" } }
      frontmatter: { metadata: { legacy_id: { eq: $legacy_id } } }
    ) {
      id
      fields {
        parentId
        filename
      }
      frontmatter {
        route_name
        metadata {
          legacy_id
        }
      }
      body
    }
    parentAreas: allMdx(
      filter:{fields:{collection:{eq:"area-indices"}, pathId:{in:$possibleParentPaths}}}
    ){
      totalCount
      edges {
        node {
          fields {
            pathId
          }
          frontmatter {
            area_name
            metadata {
              legacy_id
            }
          }
        }
      }
    }
  }
`;
