import { MapInstance } from 'react-map-gl/maplibre'
import { Geometry } from 'geojson'
import { CragFeatureProperties, CragGroupFeatureProps, SimpleClimbType, CragGroupTileProps, CragTileProps, ActiveFeature } from './TileTypes'

/**
 * Convert maplibre tile feature to our model
 * @param type
 * @param geometry
 * @param tile
 * @param mapInstance
 */
export const tileToFeature = (type: string, point: { x: number, y: number }, geometry: Geometry, tile: CragTileProps | CragGroupTileProps, mapInstance: MapInstance): ActiveFeature | null => {
  switch (type) {
    case 'crag-markers':
    case 'crag-name-labels':
      return {
        type,
        point,
        geometry: geometry as GeoJSON.Point,
        data: transformCragTileProps(tile as CragTileProps),
        mapInstance
      }
    case 'area-boundaries':
      return {
        type,
        point,
        geometry: geometry as GeoJSON.Polygon,
        data: transformCragGroupTileProps(tile as CragGroupTileProps),
        mapInstance
      }
    default: return null
  }
}
/**
 * Map tile properties can only contain primitive types.
 * This function converts stringified json data back to json objects
 */
const transformCragTileProps = (props: CragTileProps): CragFeatureProperties => {
  const { name, ancestors, pathTokens, climbs, media, content } = props
  return {
    ...props,
    areaName: name,
    ancestors: JSON.parse(ancestors) as string[],
    pathTokens: JSON.parse(pathTokens) as string[],
    climbs: JSON.parse(climbs) as SimpleClimbType[],
    media: JSON.parse(media),
    content: JSON.parse(content)
  }
}

const transformCragGroupTileProps = (props: CragGroupTileProps): CragGroupFeatureProps => {
  return {
    ...props,
    children: []// JSON.parse(children) as SimpleCragType[]
  }
}
