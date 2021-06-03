import React from "react";
import { graphql, navigate } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Link } from "gatsby";
import RouteCard from "../components/ui/RouteCard";
import slugify from "slugify";
import BreadCrumbs from "../components/ui/BreadCrumbs";
import {createNavigatePaths, pathOrParentIdToGitHubLink} from "../js/utils";
import AreaCard from "../components/ui/AreaCard";
import LinkToGithub from "../components/ui/LinkToGithub";
import shortCode_H1 from "../components/ui/shortcodes/h1";
import {template_h1_css} from "../js/styles";

const shortcodes = { 
  Link,
  h1: shortCode_H1 
};

/**
 * Templage for generating individual page for the climb
 */
export default function LeafAreaPage({ data: {mdx, climbs, parentAreas, childAreas} }) {
  const { area_name } = mdx.frontmatter;
  const {parentId, pathId, filename} = mdx.fields;
  const navigationPaths = createNavigatePaths(parentId, parentAreas.edges);
  const githubLink = pathOrParentIdToGitHubLink(pathId, filename);
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO keywords={[area_name]} title={area_name} />
      <BreadCrumbs path={parentId} navigationPaths={navigationPaths}></BreadCrumbs>
      <h1 className={template_h1_css}>{area_name}</h1>
      <MDXProvider components={shortcodes}>
        <MDXRenderer frontmatter={mdx.frontmatter}>{mdx.body}</MDXRenderer>
      </MDXProvider>
      <div className="grid grid-cols-3 gap-x-3">
        {
          childAreas.edges.map(({ node }) => {
            const {frontmatter} = node;
            const {area_name, metadata} = frontmatter;
            return(
              <div
                className="pt-6 max-h-96"
                id={slugify(area_name)}
                key={metadata.legacy_id}
              >
                <AreaCard
                  onPress={()=>{navigate(`/areas/${metadata.legacy_id}/${slugify(area_name,{lower:true})}`)}}
                  area_name={area_name}
                ></AreaCard>
              </div>
            )
          })
        }
      </div>
      <div className="grid grid-cols-3 gap-x-3">
        {
          climbs.edges.map(({ node }) => {
            const {frontmatter} = node;
            const {yds, route_name, metadata, type} = frontmatter;
            return(
              <div
                className="pt-6 max-h-96"
                id={slugify(route_name)}
                key={metadata.legacy_id}
              >
                <RouteCard
                  onPress={()=>{navigate(`/climbs/${metadata.legacy_id}/${slugify(route_name,{lower:true})}`)}}
                  route_name={route_name}
                  legacy_id={metadata.legacy_id}
                  YDS={yds}
                  // safety="{}" TODO: Find out what routes have this value?
                  type={type}
                ></RouteCard>
              </div>
            )
          })
        }
      </div>
      <LinkToGithub link={githubLink} docType="area"></LinkToGithub>
    </Layout>
  );
}

export const query = graphql`
  query ($legacy_id: String!, $pathId: String, $possibleParentPaths: [String]) {
    mdx: mdx(
      fields: { collection: { eq: "area-indices" } }
      frontmatter: { metadata: { legacy_id: { eq: $legacy_id } } }
    ) {
      id
      fields {
        parentId
        pathId
        filename
      }
      frontmatter {
        area_name
        metadata {
          legacy_id
          lng
          lat
        }
      }
      body
    }
    climbs: allMdx(
      filter:{fields:{collection:{eq:"climbing-routes"}, parentId:{eq:$pathId}}}
    ) {
      totalCount
      edges {
        node {
          fields {
            parentId
          }
          frontmatter {
            route_name
            yds
            type {
              tr
              trad
              sport
              boulder
            }
            metadata {
              legacy_id
            }
          }
        }
      }
    }
    childAreas: allMdx(
      filter: {fields:{collection:{eq:"area-indices"}, parentId:{eq:$pathId}}}
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
