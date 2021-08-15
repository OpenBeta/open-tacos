import React from "react";
import { graphql, navigate } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Link } from "gatsby";
import RouteCard from "../components/ui/RouteCard";
import BreadCrumbs from "../components/ui/BreadCrumbs";
import { createNavigatePaths, pathOrParentIdToGitHubLink } from "../js/utils";
import AreaCard from "../components/ui/AreaCard";
import LinkToGithub from "../components/ui/LinkToGithub";
import { h1, p } from "../components/ui/shortcodes.js";
import { template_h1_css } from "../js/styles";
import AreaStatistics from "../components/AreaStatistics";
import { computeStatsBarPercentPerAreaFromClimbs } from "../js/utils";

const shortcodes = {
  Link,
  h1: h1,
  p: p,
};

/**
 * Templage for generating individual page for the climb
 */
export default function LeafAreaPage({
  data: { mdx, climbs, parentAreas, childAreas, climbsPerChildArea },
}) {
  const { area_name } = mdx.frontmatter;
  const { parentId, pathId, filename } = mdx.fields;
  const navigationPaths = createNavigatePaths(parentId, parentAreas.edges);
  const githubLink = pathOrParentIdToGitHubLink(pathId, filename);
  const areasToStatsBar =
    computeStatsBarPercentPerAreaFromClimbs(climbsPerChildArea);
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO keywords={[area_name]} title={area_name} />
      <BreadCrumbs
        path={parentId}
        navigationPaths={navigationPaths}
      ></BreadCrumbs>
      <div className="float-right">
        <Link
          className="bg-yellow-300 px-4 py-2 mt-8"
          to={`/edit?file=${pathId}/${filename}.md`}
        >
          Edit Me
        </Link>
      </div>
      <h1 className={template_h1_css}>{area_name}</h1>

      <AreaStatistics climbs={climbs}></AreaStatistics>
      <MDXProvider components={shortcodes}>
        <MDXRenderer frontmatter={mdx.frontmatter}>{mdx.body}</MDXRenderer>
      </MDXProvider>
      <div className="grid grid-cols-3 gap-x-3">
        {childAreas.edges.map(({ node }) => {
          const { frontmatter } = node;
          const { area_name, metadata } = frontmatter;
          const { slug, pathId } = node.fields;
          const stats = areasToStatsBar[pathId];
          return (
            <div className="pt-6 max-h-96" key={metadata.legacy_id}>
              <div>
                <AreaCard
                  onPress={() => {
                    navigate(slug);
                  }}
                  area_name={area_name}
                  stats={stats}
                ></AreaCard>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-x-3">
        {climbs.edges.map(({ node }) => {
          const { frontmatter } = node;
          const { yds, route_name, metadata, type } = frontmatter;
          const { slug } = node.fields;
          return (
            <div className="pt-6 max-h-96" key={metadata.legacy_id}>
              <RouteCard
                //                  onPress={()=>{navigate(`/climbs/${metadata.legacy_id}/${slugify(route_name,{lower:true})}`)}}
                onPress={() => {
                  navigate(slug);
                }}
                route_name={route_name}
                legacy_id={metadata.legacy_id}
                YDS={yds}
                // safety="{}" TODO: Find out what routes have this value?
                type={type}
              ></RouteCard>
            </div>
          );
        })}
      </div>
      <LinkToGithub link={githubLink} docType="area"></LinkToGithub>
    </Layout>
  );
}

export const query = graphql`
  query (
    $legacy_id: String!
    $pathId: String
    $possibleParentPaths: [String]
    $childAreaPathIds: [String]
  ) {
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
      filter: {
        fields: {
          collection: { eq: "climbing-routes" }
          parentId: { eq: $pathId }
        }
      }
    ) {
      totalCount
      edges {
        node {
          fields {
            parentId
            slug
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
    climbsPerChildArea: allMdx(
      filter: {
        fields: {
          collection: { eq: "climbing-routes" }
          parentId: { in: $childAreaPathIds }
        }
      }
    ) {
      totalCount
      edges {
        node {
          fields {
            parentId
            slug
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
      filter: {
        fields: {
          collection: { eq: "area-indices" }
          parentId: { eq: $pathId }
        }
      }
    ) {
      totalCount
      edges {
        node {
          fields {
            pathId
            slug
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
      filter: {
        fields: {
          collection: { eq: "area-indices" }
          pathId: { in: $possibleParentPaths }
        }
      }
    ) {
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
