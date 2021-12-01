import React from "react";
import { graphql, navigate, Link } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import Droppin from "../assets/icons/droppin.svg";
import RouteCard from "../components/ui/RouteCard";
import BreadCrumbs from "../components/ui/BreadCrumbs";
import { pathOrParentIdToGitHubLink } from "../js/utils";
import AreaCard from "../components/ui/AreaCard";
import LinkToGithub from "../components/ui/LinkToGithub";
import { template_h1_css } from "../js/styles";
import AreaStatistics from "../components/AreaStatistics";
import ClimbDetail from "../components/graphql/ClimbDetail";
import AreaDetail from "../components/graphql/AreaDetail";

/**
 * Templage for generating individual Area page
 */
export default function LeafAreaPage({ data: { area } }) {
  const { area_name, metadata } = area.frontmatter;
  const { pathTokens, rawPath, parent, children } = area;

  //return (<div>{JSON.stringify(area)}</div>)
  // Area.children[] can contain either sub-Areas or Climbs, but not both.
  // 'hasChildAreas' is a simple test to determine what we have.
  const hasChildAreas =
    children.length > 0 && children[0].frontmatter.area_name ? true : false;
  const githubLink = pathOrParentIdToGitHubLink(rawPath, "index");
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO keywords={[area_name]} title={area_name} />
      <BreadCrumbs pathTokens={pathTokens} />
      <h1 className={template_h1_css}>{area_name}</h1>
      <span className="flex items-center flex-shrink text-gray-500 text-xs gap-x-1">
        <Droppin className="stroke-current" />
        <a
          className="hover:underline hover:text-gray-800"
          href={`https://www.openstreetmap.org/#map=13/${metadata.lat}/${metadata.lng}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {metadata.lat},{metadata.lng}
        </a>
      </span>
      {!hasChildAreas && <AreaStatistics climbs={children}></AreaStatistics>}
      <div
        className="markdown"
        dangerouslySetInnerHTML={{ __html: parent.html }}
      ></div>
      {parent.wordCount.words < 20 && (
        <Cta isEmpty={parent.wordCount.words === 1} rawPath={rawPath}/>
      )}
      {hasChildAreas && (
        <div className="sm:grid grid-cols-3 gap-x-3">
          {children.map((node) => {
            const { frontmatter, slug } = node;
            const { area_name, metadata } = frontmatter;
            return (
              <div className="pt-6 max-h-96" key={metadata.area_id}>
                <Link to={slug}>
                  <AreaCard area_name={area_name}></AreaCard>
                </Link>
              </div>
            );
          })}
        </div>
      )}
      <div className="sm:grid grid-cols-3 gap-x-3">
        {!hasChildAreas &&
          children.map((node) => {
            const { frontmatter, slug } = node;
            const { yds, route_name, metadata, type } = frontmatter;
            return (
              <div className="pt-6 max-h-96" key={metadata.climb_id}>
                <Link to={slug}>
                  <RouteCard
                    route_name={route_name}
                    climb_id={metadata.climb_id}
                    YDS={yds}
                    // safety="{}" TODO: Find out what routes have this value?
                    type={type}
                  ></RouteCard>
                </Link>
              </div>
            );
          })}
      </div>
      <LinkToGithub link={githubLink} docType="areas"></LinkToGithub>
    </Layout>
  );
}

const Cta = ({ isEmpty, rawPath }) => (
  <div className="rounded border-2 p-4 border-gray-700 flex flex-col flex-nowrap gap-y-4 md:gap-x-4 md:flex-row  items-center justify-center ">
    <div className="text-center">
      {isEmpty
        ? `This area description is empty. Be the first to contribute!`
        : `Help us improve this page`}
    </div>
    <div>
      <button
        className="btn btn-primary"
        onClick={() => navigate(`/edit?file=${rawPath}/index.md`)}
      >
        Edit
      </button>
    </div>
  </div>
);

export const query = graphql`
  query ($node_id: String!) {
    area: area(id: { eq: $node_id }) {
      ...AreaDetailFragment
      parent {
        ... on MarkdownRemark {
          html
          wordCount {
            words
          }
        }
      }
      children {
        ...AreaDetailFragment
        ...ClimbDetailFragment
      }
    }
  }
`;
