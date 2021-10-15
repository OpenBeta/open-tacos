import React from "react";
import { graphql, navigate } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import BreadCrumbs from "../components/ui/BreadCrumbs";
import { pathOrParentIdToGitHubLink } from "../js/utils";
import LinkToGithub from "../components/ui/LinkToGithub";
import { h1, h2, p } from "../components/ui/shortcodes";
import { template_h1_css } from "../js/styles";
import RouteGradeChip from "../components/ui/RouteGradeChip";
import RouteTypeChips from "../components/ui/RouteTypeChips";
import ClimbDetail from "../components/graphql/ClimbDetail";

const shortcodes = {
  h1,
  h2,
  p,
}; // Provide common components here

/**
 * Templage for generating individual page for the climb
 */
export default function ClimbPage({ data: { climb } }) {
  const { route_name, yds, type, safety } = climb.frontmatter;
  const { rawPath, filename, pathTokens, parent } = climb;
  const githubLink = pathOrParentIdToGitHubLink(rawPath, filename);
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO keywords={[route_name]} title={route_name} />
      <BreadCrumbs pathTokens={pathTokens} isClimbPage={true} />
      <h1 className={template_h1_css}>{route_name}</h1>
      <div className="float-right">
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/edit?file=${rawPath}/${filename}.md`)}
        >
          Edit
        </button>
      </div>
      <RouteGradeChip yds={yds} safety={safety}></RouteGradeChip>
      <RouteTypeChips type={type}></RouteTypeChips>
      <MDXProvider components={shortcodes}>
        <MDXRenderer frontmatter={climb.frontmatter}>
          {parent.body}
        </MDXRenderer>
      </MDXProvider>
      <LinkToGithub link={githubLink} docType="climb"></LinkToGithub>
    </Layout>
  );
}

export const query = graphql`
  query ($node_id: String!) {
    climb: climb(id: { eq: $node_id }) {
      ...ClimbDetailFragment
      parent {
        ... on Mdx {
          body
        }
      }
    }
  }
`;

