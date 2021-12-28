import bbox from '@turf/bbox'
import { fitBounds } from '@math.gl/web-mercator'

export const bboxFromGeoJson = (geojson) => {
  const _bbox = bbox(geojson)
  if (_bbox[0] === _bbox[2] && _bbox[1] === _bbox[3]) {
    // if all features are the same point bbox is single point
    // we need to artifically create a small bbox or deck.gl will crash
    return [
      _bbox[0] - 0.005,
      _bbox[1] - 0.005,
      _bbox[2] + 0.005,
      _bbox[3] + 0.005
    ]
  }
  return [_bbox[0], _bbox[1], _bbox[2], _bbox[3]]
}

export const bbox2Viewport = (bbox, width, height) => {
  return fitBounds({
    width: width,
    height: height,
    bounds: [bbox.slice(0, 2), bbox.slice(2, 4)],
    padding: Math.min(width, height) * 0.05
  })
}
