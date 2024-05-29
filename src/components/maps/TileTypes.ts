import { Point, Polygon } from '@turf/helpers'
import { MapInstance } from 'react-map-gl/maplibre'
import { AreaType, ClimbType, MediaWithTags } from '@/js/types'

export type LayerId = 'crag-markers' | 'crag-name-labels' | 'area-boundaries'

export type TileProps = CragTileProps | CragGroupTileProps

export interface CragTileProps {
  id: string
  name: string
  ancestors: string
  pathTokens: string
  content: string
  climbs: string
  media: string
  totalClimbs: number
}

export interface CragGroupTileProps {
  id: string
  areaName: string
  pathTokens: string
  ancestors: string
  media: string // stringified json
  children: string // stringified json
  content: string // stringified json
  totalClimbs: number
  aggregate: string // stringified json
}

export type SimpleClimbType = Pick<ClimbType, 'id' | 'name' | 'type'>

export type MediaWithTagsInMapTile = MediaWithTags

type AreaFeatureProperties = Pick<AreaType, 'id' | 'areaName' | 'content' | 'ancestors' | 'pathTokens' | 'totalClimbs'> & {
  media: MediaWithTagsInMapTile[]
}

export type CragFeatureProperties = AreaFeatureProperties & {
  climbs: SimpleClimbType[]
}

export type SubArea = Pick<AreaType, 'id' | 'areaName' | 'totalClimbs' | 'aggregate'>

export type CragGroupFeatureProps = Pick<AreaType, 'totalClimbs' | 'aggregate'> & AreaFeatureProperties & {
  subareas: SubArea[]
  media: MediaWithTagsInMapTile[]
}

export type FeatureProps = CragGroupFeatureProps | CragFeatureProperties

export interface ActiveFeature {
  type: LayerId
  point: { x: number, y: number }
  geometry: Point | Polygon
  data: FeatureProps
  mapInstance: MapInstance
}
