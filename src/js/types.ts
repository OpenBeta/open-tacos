import { BBox, Feature } from '@turf/helpers'
import { BaseItem } from '@algolia/autocomplete-core'

export interface AreaMetadataType {
  leaf: boolean
  lat: number
  lng: number
  bbox: [number, number, number, number]
  left_right_index: number
  mp_id: string
  area_id: string
  areaId: string
}

export enum SafetyType {
  UNSPECIFIED = 'UNSPECIFIED',
  PG = 'PG',
  PG13 = 'PG13',
  R = 'R',
  X = 'X',
}

export interface ClimbMetadataType {
  lat: number
  lng: number
  left_right_index: string
  mp_id: string
  climbId: string
}

export type ClimbDiscipline = 'sport' | 'bouldering' | 'alpine' | 'tr' | 'trad' | 'mixed' | 'aid'

export type ClimbDisciplineRecord = Record<ClimbDiscipline, boolean>

export interface Climb {
  id: string
  name: string
  fa: string
  yds: string
  metadata: ClimbMetadataType
  type: ClimbDisciplineRecord
  safety: SafetyType
  content: {
    description: string
    location: string
    protection: string
  }
  ancestors: string[]
  pathTokens: string[]
  media: Array<MediaClimbTag|MediaAreaTag>
}

export interface CountByGroupType {
  count: number
  label: string
}

export interface CountByDisciplineType {
  trad?: DisciplineStatsType
  sport?: DisciplineStatsType
  boulder?: DisciplineStatsType
  alpine?: DisciplineStatsType
  mixed?: DisciplineStatsType
  aid?: DisciplineStatsType
  tr?: DisciplineStatsType
}

export interface DisciplineStatsType {
  total: number
  bands: CountByGradeBandType
}

export interface CountByGradeBandType {
  beginner: number
  intermediate: number
  advance: number
  expert: number
}

export interface Point {
  lat: number
  lng: number
}
export interface AggregateType {
  byGrade: CountByGroupType[]
  byDiscipline: CountByDisciplineType
  byGradeBand: CountByGradeBandType

}
export interface AreaType {
  id: string
  uuid: string
  areaName: string
  pathTokens: string[]
  metadata: AreaMetadataType
  ancestors: string[]
  aggregate: AggregateType
  totalClimbs: number
  density: number
  content: {
    description: string
  }
  children: AreaType[]
  climbs: Climb[]
  media: [MediaClimbTag]
}

export interface AreaResponseType {
  areas: AreaType[]
}

export interface IndexResponseType {
  areas: AreaType[]
  area: AreaType
}

export interface ClimbResponseType {
  climbs: Climb[]
}

export type BBoxType = BBox
export type GeojsonFeatureType = Feature

export interface AlgoliaResultType {
  objectID: string
}
export type ClimbAlgoliaType = Climb & AlgoliaResultType

export interface TypesenseDocumentType extends BaseItem {
  climbUUID: string
  climbDesc: string
  climbName: string
  disciplines: ClimbDiscipline[]
  fa: string
  grade: string
  safety: SafetyType
  areaNames: string[]
}

export enum GradeBand {
  beginner = '0',
  intermediate = '1',
  advanced = '2',
  expert = '3'
}

export interface RadiusRange {
  rangeMeters: number[]
  rangeIndices: number[]
}

/// /////////////////////////////////////////////
// Map interactive states

export interface MarkerStateType {
  areaId: string
  lnglat: number[]
}

/// /////////////////////////////////////////////
// Media tags

export interface MediaBaseTag {
  mediaUuid: string
  mediaUrl: string
  mediaType: number
  destType: number
}
export interface MediaClimbTag extends MediaBaseTag {
  climb: Pick<Climb, 'id' | 'name'>
}

export interface MediaAreaTag extends MediaBaseTag {
  area: Pick<AreaType, 'id'>
}

export type MediaTag = MediaClimbTag | MediaAreaTag

export interface MediaType {
  ownerId: string
  mediaId: string
  filename: string
  ctime: Date
  mtime: Date
  contentType: string
  meta: any
}
