import { graphql } from "gatsby";
export const query = graphql`
  fragment AreaDetailFragment on Area {
    id
    slug
    rawPath
    pathTokens
    frontmatter {
      area_name
      metadata {
        area_id
        lng
        lat
      }
    }
  }
`;
