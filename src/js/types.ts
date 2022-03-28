import { BBox, Feature } from '@turf/helpers'

export interface AreaMetadataType {
  leaf: boolean
  lat: number
  lng: number
  bbox: [number, number, number, number]
  left_right_index: number
  mp_id: string
  area_id: string
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
  climb_id: string
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
  area_name: string
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

export interface TypesenseDocumentType {
  climbId: string
  climbDesc: string
  climbName: string
  disciplines: string[]
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
