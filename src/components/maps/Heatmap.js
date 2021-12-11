import React, { useEffect, useState } from "react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { GeoJsonLayer } from "@deck.gl/layers";

// import { useStaticQuery, graphql } from "gatsby"
import usaHeatMapData from "../../assets/usa-heatmap.json";
import BaseMap from "./BaseMap";
import { bboxFromGeoJson, bbox2Viewport } from "../../js/GeoHelpers";

const Color_Range = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

const getMapDivDimensions = (id) => {
  const div = document.getElementById(id);
  let width = 200;
  if (div) {
    console.log(div);
    width = div.clientWidth;
  }
  const height = window.innerHeight - 66;
  return { width, height };
};

export default function Heatmap({ geojson }) {
  const [[width, height], setWH] = useState([400, window.innerHeight - 66]);
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const updateDimensions = () => {
    const { width, height } = getMapDivDimensions("my-area-map");
    setWH([width, height]);
    console.log("## wxh", width, height);
  };

  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer",
      data: geojson ? geojson : [],
      pickable: false,
      stroked: true,
      filled: true,
      extruded: true,
      pointType: "circle",
      lineWidthScale: 20,
      lineWidthMinPixels: 5,
      getFillColor: [87, 255, 54],
      opacity: 0.02,
      getLineColor: (d) => [87, 255, 54, 0.8],
      getPointRadius: 100,
      getLineWidth: 10,
      getElevation: 30,
    }),
    new HeatmapLayer({
      data: usaHeatMapData,
      id: "heatmp-layer",
      pickable: false,
      getPosition: (d) => [d.lon, d.lat],
      getWeight: (d) => 1,
      radiusPixels: 20,
      intensity: 1,
      threshold: 0.03,
      opacity: 0.75,
      colorRange: Color_Range,
    }),
  ];

  console.log("## wxh", width, height);

  const bbox = bboxFromGeoJson(geojson);
  const vs = bbox2Viewport(bbox, width, height);
  return (
    <div
      id="my-area-map"
      className="w-full xl:sticky xl:top-16 z-9"
      style={{ height }}
    >
      <BaseMap layers={layers} initialViewState={vs} />
    </div>
  );
}
