import React from "react";
import DeckGL from "@deck.gl/react";
import { StaticMap } from "react-map-gl";

export const DEFAULT_INITIAL_VIEWSTATE = {
  width: 300,
  height: 400,
  bearing: 0,
  zoom: 8,
  pitch: 15,
  transitionDuration: 1000,
  latitude: 44.968,
  longitude: -103.77154,
};

const BaseMap = ({ layers, disableController, initialViewState }) => {
  const vs = { DEFAULT_INITIAL_VIEWSTATE, ...initialViewState };
  return (
    <DeckGL
      initialViewState={vs}
      //viewState={viewState}
      layers={layers}
      controller={
        !disableController
          ? {
              dragRotate: true,
              doubleClickZoom: true,
              keyboard: false,
              scrollZoom: true,
            }
          : null
      }
    >
      <StaticMap
        reuseMaps
        mapStyle="mapbox://styles/mappandas/ckx1h60kg18rj14nqyup4lzxi"
        preventStyleDiffing={true}
        mapboxApiAccessToken="pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg"
      />
    </DeckGL>
  );
};

export default BaseMap;
