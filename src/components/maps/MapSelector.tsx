import type { StyleSpecification } from 'maplibre-gl'
import darkMatterStyle from '@/components/maps/styles/dark-matter.json'

const satelliteStyle: StyleSpecification = {
  version: 8,
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: {
    satellite: {
      type: 'raster',
      tiles: [
        'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg'
      ],
      tileSize: 256,
      attribution: '<a target="_blank" href="https://s2maps.eu">Sentinel-2 cloudless - https://s2maps.eu</a> by <a href="https://eox.at/">EOX IT Services GmbH</a>'
    }
  },
  layers: [{
    id: 'satellite',
    type: 'raster',
    source: 'satellite'
  }]
}

export const MAP_STYLES = {
  outdoor: {
    style: 'https://tiles.openfreemap.org/styles/liberty',
    imgUrl: '/images/map-thumbnails/outdoor.webp'
  },
  light: {
    style: 'https://tiles.openfreemap.org/styles/positron',
    imgUrl: '/images/map-thumbnails/light.webp'
  },
  dark: {
    style: darkMatterStyle as StyleSpecification,
    imgUrl: '/images/map-thumbnails/dark.webp'
  },
  satellite: {
    style: satelliteStyle,
    imgUrl: '/images/map-thumbnails/satellite.webp'
  }
}

export type MapStyles = typeof MAP_STYLES
