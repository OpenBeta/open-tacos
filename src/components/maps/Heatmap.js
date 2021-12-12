import React, { useEffect, useState, useCallback } from "react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { GeoJsonLayer } from "@deck.gl/layers";

import usaHeatMapData from "../../assets/usa-heatmap.json";
import BaseMap, { DEFAULT_INITIAL_VIEWSTATE } from "./BaseMap";
import { bboxFromGeoJson, bbox2Viewport } from "../../js/GeoHelpers";

const Color_Range = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

const NAV_BAR_OFFSET = 66;

export default function Heatmap({ geojson }) {
  const [[width, height], setWH] = useState([400, window.innerHeight - NAV_BAR_OFFSET]);
  const [viewstate, setViewState] = useState(DEFAULT_INITIAL_VIEWSTATE);

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    const bbox = bboxFromGeoJson(geojson);
    const vs = bbox2Viewport(bbox, width, height);
    setViewState(vs);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const onViewStateChange = useCallback(({ viewState }) => {
    setViewState(viewState);
  });

  const updateDimensions = useCallback(() => {
    const { width, height } = getMapDivDimensions("my-area-map");
    setWH([width, height]);
  });

  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer",
      data: geojson ? geojson : [],
      pickable: false,
      stroked: true,
      filled: viewstate.zoom < 8,
      extruded: false,
      pointType: "circle",
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [251, 113, 133, 50],
      opacity: viewstate.zoom < 6 ? 1 : 0.2,
      getLineColor: [253, 164, 175],
      getPointRadius: 100,
      getLineWidth: 4,
      getElevation: 0,
    }),
    new HeatmapLayer({
      data: usaHeatMapData,
      id: "heatmp-layer",
      pickable: false,
      getPosition: (d) => [d.lon, d.lat, 10],
      getWeight: 1,
      radiusPixels: 20,
      intensity: 1,
      threshold: 0.03,
      opacity: 0.65,
      colorRange: Color_Range,
    }),
  ];

  return (
    <div
      id="my-area-map"
      className="w-full xl:sticky xl:top-16 z-9 bg-blue-50"
      style={{ height }}
    >
      <BaseMap
        layers={layers}
        initialViewState={viewstate}
        viewstate={viewstate}
        onViewStateChange={onViewStateChange}
      />
    </div>
  );
}

const getMapDivDimensions = (id) => {
  const div = document.getElementById(id);
  let width = 200;
  if (div) {
    console.log(div);
    width = div.clientWidth;
  }
  const height = window.innerHeight - NAV_BAR_OFFSET;
  return { width, height };
};
