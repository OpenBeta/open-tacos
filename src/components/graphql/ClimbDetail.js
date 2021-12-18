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
        climb_id
        mp_id
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
