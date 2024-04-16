export const MAP_STYLES: MapStyles = {
  outdoor: {
    style: 'https://api.maptiler.com/maps/outdoor-v2/style.json?key=ejjLkz58mUNz9TgNs0Ed',
    imgUrl: 'https://docs.maptiler.com/sdk-js/api/map-styles/img/style-outdoor-v2.jpeg'
  },
  dataviz: {
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=ejjLkz58mUNz9TgNs0Ed',
    imgUrl: 'https://docs.maptiler.com/sdk-js/api/map-styles/img/style-bright-v2-pastel.jpeg'
  },
  basic: {
    style: 'https://api.maptiler.com/maps/basic/style.json?key=ejjLkz58mUNz9TgNs0Ed',
    imgUrl: 'https://docs.maptiler.com/sdk-js/api/map-styles/img/style-basic-v2.jpeg'
  },
  satellite: {
    style: 'https://api.maptiler.com/maps/satellite/style.json?key=ejjLkz58mUNz9TgNs0Ed',
    imgUrl: 'https://docs.maptiler.com/sdk-js/api/map-styles/img/style-satellite.jpeg'
  }
}
export interface MapStyles {
  outdoor: {
    style: string
    imgUrl: string
  }
  dataviz: {
    style: string
    imgUrl: string
  }
  basic: {
    style: string
    imgUrl: string
  }
  satellite: {
    style: string
    imgUrl: string
  }
}
