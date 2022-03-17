import { fitBounds } from '@math.gl/web-mercator'
import bbox from '@turf/bbox'
import { FeatureCollection, Feature } from '@turf/helpers'

import { BBoxType } from './types'

export const bboxFromGeoJson = (geojson: FeatureCollection | Feature): BBoxType => {
  const _bbox = bbox(geojson)
  if (_bbox[0] === _bbox[2] && _bbox[1] === _bbox[3]) {
    // If all features are the same point, bbox is also single point.
    // We need to artifically create a small bbox around the point or deck.gl will crash
    return [
      _bbox[0] - 0.005,
      _bbox[1] - 0.005,
      _bbox[2] + 0.005,
      _bbox[3] + 0.005
    ]
  }
  return [_bbox[0], _bbox[1], _bbox[2], _bbox[3]]
}

export const bbox2Viewport = (bbox: BBoxType, width: number, height: number): any => {
  return fitBounds({
    width: width,
    height: height,
    bounds: [[bbox[0], bbox[1]], [bbox[2], bbox[3]]]
    // padding: 100
  })
}
