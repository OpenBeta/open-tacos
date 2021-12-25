import { graphql } from "gatsby";
export const query = graphql`
  fragment AreaDetailFragment on Area {
    id
    slug
    rawPath
    pathTokens
    gradeCount {
      grade
      count
    }
    typeCount {
      type
      count
    }
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
