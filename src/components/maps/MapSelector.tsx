const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY !== undefined ? process.env.NEXT_PUBLIC_MAPTILER_API_KEY : 'key'
export const MAP_STYLES: MapStyles = {
  outdoor: {
    style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${MAPTILER_KEY}`,
    imgUrl: 'https://docs.maptiler.com/sdk-js/api/map-styles/img/style-outdoor-v2.jpeg'
  },
  light: {
    style: `https://api.maptiler.com/maps/dataviz/style.json?key=${MAPTILER_KEY}`,
    imgUrl: 'https://docs.maptiler.com/sdk-js/api/map-styles/img/style-bright-v2-pastel.jpeg'
  },
  dark: {
    style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}`,
    imgUrl: 'https://docs.maptiler.com/sdk-js/api/map-styles/img/style-dataviz-dark.jpeg'
  },
  satellite: {
    style: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`,
    imgUrl: 'https://docs.maptiler.com/sdk-js/api/map-styles/img/style-satellite.jpeg'
  }
}
export interface MapStyles {
  outdoor: {
    style: string
    imgUrl: string
  }
  light: {
    style: string
    imgUrl: string
  }
  dark: {
    style: string
    imgUrl: string
  }
  satellite: {
    style: string
    imgUrl: string
  }
}
