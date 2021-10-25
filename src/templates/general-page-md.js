import React from "react";
import { graphql, navigate } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";

export default function GeneralMPaage({ data: { markdown } }) {
  const { title } = markdown.frontmatter;
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO title={title} />
      <div
        className="markdown"
        dangerouslySetInnerHTML={{ __html: markdown.html }}
      ></div>
    </Layout>
  );
}

export const query = graphql`
  query ($node_id: String!) {
    markdown: markdownRemark(id: { eq: $node_id }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
