import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Card from "../components/ui/card"

export default function ClimbPage({ data }) {
    console.log(data)
  //const { fa, description, protection, YDS, location, route_name } = data.routesJson;
  return (
      <Card {...data.routesJson}/>
  );
}

ClimbPage.propTypes = {
  data: PropTypes.object,
};
export const query = graphql`
  query($mp_route_id: String!) {
    routesJson(metadata: { mp_route_id: { eq: $mp_route_id } }) {
      route_name
      fa
      YDS
      description
      location
      protection
      safety
      type {
        trad
        tr
        aid
        boulder
        sport
        ice
        alpine
        mixed
        snow
      }
    }
  }
`;
