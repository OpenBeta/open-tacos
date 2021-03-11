import React from "react";
import { graphql } from "gatsby";
import { Layout, SEO } from "../components/layout";

export default function ClimbPage({ data }) {
  console.log(data);
  return (
    <Layout>
      <SEO keywords={[`foo`, `bar`]} title="About" />
      <div>Hello blog post</div>
    </Layout>
  );
}

// export const query = graphql`
//   query($mp_route_id: String!) {
//     routesJson(metadata: { mp_route_id: { eq: $mp_route_id } }) {
//       route_name
//       fa
//     }
//   }
// `;
