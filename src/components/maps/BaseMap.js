import React from "react";
import DeckGL from "@deck.gl/react";
import { _MapContext as MapContext, InteractiveMap } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export const DEFAULT_INITIAL_VIEWSTATE = {
  width: 300,
  height: 400,
  bearing: 0,
  zoom: 5,
  pitch: 15,
  transitionDuration: 1000,
  latitude: 44.968,
  longitude: -103.77154,
};

const BaseMap = ({
  layers,
  disableController,
  viewstate,
  onViewStateChange,
  getTooltip,
  children,
}) => {
  return (
    <DeckGL
      ContextProvider={MapContext.Provider}
      viewState={viewstate}
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
      onViewStateChange={onViewStateChange}
      getTooltip={getTooltip}
    >
      <InteractiveMap
        reuseMaps={true}
        preventStyleDiffing={false}
        mapStyle="mapbox://styles/mappandas/ckx1h60kg18rj14nqyup4lzxi"
        mapboxApiAccessToken="pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg"
      />
      {children}
    </DeckGL>
  );
};

export default BaseMap;
