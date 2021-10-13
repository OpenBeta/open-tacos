import { graphql } from "gatsby";
export const query = graphql`
  fragment ClimbDetailFragment on Climb {
    id
    slug
    rawPath
    pathTokens
    filename
    frontmatter {
      route_name
      metadata {
        legacy_id
      }
      yds
      safety
      type {
        tr
        trad
        sport
        boulder
        aid
        alpine
        mixed
      }
    }
    parent {
      ... on Mdx {
        body
      }
    }
  }
`;
