import React, { useState } from "react";
import { graphql, navigate, Link } from "gatsby";
import { point } from "@turf/helpers";
import Layout from "../components/layout";
import SEO from "../components/seo";
import Droppin from "../assets/icons/droppin.svg";
import Pencil from "../assets/icons/pencil-sm.svg";
import RouteCard from "../components/ui/RouteCard";
import BreadCrumbs from "../components/ui/BreadCrumbs";
import { getScoreForYdsGrade, pathOrParentIdToGitHubLink } from "../js/utils";
import AreaCard from "../components/ui/AreaCard";
import LinkToGithub from "../components/ui/LinkToGithub";
import { template_h1_css } from "../js/styles";
import AreaStatistics from "../components/AreaStatistics";
import Heatmap from "../components/maps/Heatmap";
import ButtonGroup from "../components/ui/ButtonGroup";
import { Button } from "../components/ui/Button";
import ClimbDetail from "../components/graphql/ClimbDetail";
import AreaDetail from "../components/graphql/AreaDetail";
/**
 * Templage for generating individual Area page
 */
export default function LeafAreaPage({ data: { area, gisBoundary } }) {
  const { area_name, metadata } = area.frontmatter;
  const { pathTokens, rawPath, parent, children } = area;

  const [selectedClimbSort, setSelectedClimbSort] = useState(0);

  const boundaryOrPoint = gisBoundary
    ? JSON.parse(gisBoundary.rawGeojson)
    : point([metadata.lng, metadata.lat]);

  //return (<div>{JSON.stringify(area)}</div>)
  // Area.children[] can contain either sub-Areas or Climbs, but not both.
  // 'hasChildAreas' is a simple test to determine what we have.
  const hasChildAreas =
    children.length > 0 && children[0].frontmatter.area_name ? true : false;
  const githubLink = pathOrParentIdToGitHubLink(rawPath, "index");

  // when to show large edit CTA
  const showEditCTA = parent.wordCount.words < 40;
  const climbSortByOptions = [
    { value: "leftToRight", text: "Left To Right" },
    { value: "grade", text: "Grade" },
  ];
  return (
    <Layout layoutClz="layout-wide">
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO keywords={[area_name]} title={area_name} />
      <div className="overflow-y">
        <div className="xl:flex xl:flex-row xl:gap-x-4 xl:justify-center xl:items-stretch">
          <div className="xl:flex-none xl:max-w-screen-md xl:w-full">
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
            {!hasChildAreas && (
              <AreaStatistics climbs={children}></AreaStatistics>
            )}
            {!showEditCTA && (
              <div className="flex justify-end">
                <EditButton label="Improve this page" rawPath={rawPath} />
              </div>
            )}
            {showEditCTA && (
              <Cta isEmpty={parent.wordCount.words === 1} rawPath={rawPath} />
            )}
            <div
              className="markdown"
              dangerouslySetInnerHTML={{ __html: parent.html }}
            ></div>
            <hr className="my-8" />

            {hasChildAreas && (
              <>
                <div className="divide-x markdown h1">Subareas</div>
                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-3 gap-y-3">
                  {children.map((node) => {
                    const { frontmatter, slug } = node;
                    const { area_name, metadata } = frontmatter;
                    return (
                      <div className="max-h-96" key={metadata.area_id}>
                        <Link to={slug}>
                          <AreaCard area_name={area_name}></AreaCard>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {!hasChildAreas && children.length > 1 && (
              <ButtonGroup
                id="sortByOptions"
                selected={[selectedClimbSort]}
                onClick={(_, index) => {
                  setSelectedClimbSort(index);
                }}
                className="text-right"
              >
                {climbSortByOptions.map(({ text }, index) => {
                  return (
                    <Button
                      key={index}
                      id={index}
                      label={text}
                      active={selectedClimbSort === index}
                    />
                  );
                })}
              </ButtonGroup>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-3">
              {!hasChildAreas &&
                sortRoutes(children, climbSortByOptions[selectedClimbSort]).map(
                  (node) => {
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
                  }
                )}
            </div>
          </div>
          <div className="w-full relative mt-8 flex bg-blue-50 xl:mt-0">
            <Heatmap
              geojson={boundaryOrPoint}
              children={hasChildAreas ? children : []}
              getTooltip={getMapTooltip}
            />
          </div>
        </div>
      </div>
      <LinkToGithub link={githubLink} docType="areas"></LinkToGithub>
    </Layout>
  );
}

const getMapTooltip = ({ object }) =>
  object && {
    text: `${
      object.frontmatter.area_name
    }\nTotal Climbs: ${object.typeCount.reduce((acc, c) => acc + c.count, 0)}`,
    className: "bg-black rounded text-white",
    style: { color: "", "background-color": "" },
  };

const sortRoutes = (routes, sortType) => {
  switch (sortType.value) {
    case "leftToRight": {
      return routes.sort(
        (a, b) =>
          parseInt(a.frontmatter.metadata.left_right_index, 10) -
          parseInt(b.frontmatter.metadata.left_right_index, 10)
      );
    }
    case "grade": {
      return routes.sort(
        (a, b) =>
          getScoreForYdsGrade(a.frontmatter.yds) -
          getScoreForYdsGrade(b.frontmatter.yds)
      );
    }
    default:
      return routes;
  }
};

const EditButton = ({ icon, label, classes, rawPath }) => (
  <button
    className={`btn whitespace-nowrap ${classes || "btn-secondary"} ${
      icon && "px-4"
    }`}
    onClick={() => navigate(`/edit?file=${rawPath}/index.md`)}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </button>
);

const Cta = ({ isEmpty, rawPath }) => (
  <div className="my-8 rounded border-2 p-4 border-gray-600 flex flex-col flex-nowrap gap-y-4 md:gap-x-4 md:flex-row  items-center justify-center ">
    <div className="text-center">
      {isEmpty
        ? `This area description is empty. Be the first to contribute!`
        : `Help us improve this page`}
    </div>
    <div>
      <EditButton
        icon={<Pencil className="inline w-4 h-4" />}
        label="Edit"
        classes="btn-primary"
        rawPath={rawPath}
      />
    </div>
  </div>
);

export const query = graphql`
  query ($node_id: String!, $rawPath: String!) {
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
    gisBoundary: geojsonArea(rawPath: { eq: $rawPath }) {
      rawGeojson
    }
  }
`;
