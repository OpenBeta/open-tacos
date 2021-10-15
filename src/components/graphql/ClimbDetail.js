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
      fa
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
  }
`;
