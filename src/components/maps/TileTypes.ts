import { Point, Polygon } from '@turf/helpers'
import { MapInstance } from 'react-map-gl/maplibre'
import { AreaType, ClimbType, MediaWithTags } from '@/js/types'

export type LayerId = 'crag-markers' | 'crag-name-labels' | 'crag-group-boundaries'

export type TileProps = CragTileProps | CragGroupTileProps

export interface CragTileProps {
  id: string
  name: string
  ancestors: string
  pathTokens: string
  content: string
  climbs: string
  media: string
}

export interface CragGroupTileProps {
  id: string
  name: string
  children: string
}

export type SimpleClimbType = Pick<ClimbType, 'id' | 'name' | 'type'>

export type MediaWithTagsInMapTile = Omit<MediaWithTags, 'id'> & { _id: string }
export type CragFeatureProperties = Pick<AreaType, 'id' | 'areaName' | 'content' | 'ancestors' | 'pathTokens'> & {
  climbs: SimpleClimbType[]
  media: MediaWithTagsInMapTile[]
}
export interface SimpleCragType {
  id: string
  name: string
}

export interface CragGroupFeatureProps {
  id: string
  name: string
  children: SimpleCragType[]
}

export type FeatureProps = CragGroupFeatureProps | CragFeatureProperties

export interface ActiveFeature {
  type: 'crags' | 'crag-groups' // typically name of the data layer
  point: { x: number, y: number }
  geometry: Point | Polygon
  data: FeatureProps
  mapInstance: MapInstance
}
