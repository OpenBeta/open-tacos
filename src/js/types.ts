import { BBox, Feature } from '@turf/helpers'
import { ViewState } from 'react-map-gl'
import { BaseItem } from '@algolia/autocomplete-core'
import { RegisterOptions } from 'react-hook-form'
import { GradeScalesTypes } from '@openbeta/sandbag'
import { IUserProfile } from './types/User'

export type { IUserProfile }
export interface AreaMetadataType {
  leaf: boolean
  isDestination: boolean
  isBoulder: boolean
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
  leftRightIndex: number
  mp_id: string
  climbId: string
}

export type GradeContextType = 'US' | 'FR'

export type ClimbDiscipline = 'sport' | 'bouldering' | 'alpine' | 'tr' | 'trad' | 'mixed' | 'aid' | 'ice' | 'snow'

export type ClimbDisciplineRecord = Record<ClimbDiscipline, boolean>

export type GradeValuesType = { [Key in GradeScalesTypes]?: string}

export type Climb = EditMetadataType & {
  id: string
  name: string
  fa: string
  yds: string
  grades: GradeValuesType
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
  media: MediaBaseTag[]
  parent: AreaType
}

export type ClimbType = Climb

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
  advanced: number
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

export interface EditMetadataType {
  updatedAt?: number
  updatedBy?: string
  createdAt?: number
  createdBy?: string
}

export type AreaType = EditMetadataType & {
  id: string
  uuid: string
  areaName: string
  shortCode?: string
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
  media: MediaBaseTag[]
  gradeContext: GradeContextType
}

export interface AreaUpdatableFieldsType {
  areaName?: string
  description?: string
  isDestination?: boolean
  isLeaf?: boolean
  isBoulder?: boolean
  shortCode?: string
  lat?: number
  lng?: number
  climbs?: ClimbType[]
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

export enum EntityType {
  climb = 'climb',
  area = 'area',
  crag = 'crag',
}

export interface TypesenseDocumentType extends BaseItem {
  type: EntityType
  climbUUID: string
  climbDesc: string
  climbName: string
  disciplines: ClimbDiscipline[]
  fa: string
  grade: string
  safety: SafetyType
  areaNames: string[]
}

export interface TypesenseAreaType extends BaseItem {
  type: EntityType
  id: string
  name: string
  pathTokens: string[]
  highlightIndices: number[]
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
  id: string
  mediaUuid: string
  mediaUrl: string
  mediaType: number
  destType: number
  destination: string | null
  uid: string | null
  mediaInfo?: MediaType
}

export interface MediaTagWithClimb extends MediaBaseTag {
  climb: Pick<Climb, 'id' | 'name'>
}

export interface MediaTagWithArea extends MediaBaseTag {
  area: Pick<AreaType, 'uuid' | 'areaName' | 'metadata'> & { metadata: Pick<AreaMetadataType, 'leaf'|'areaId'> }
}

export type HybridMediaTag = MediaTagWithArea | MediaTagWithClimb

export interface MediaByAuthor {
  authorUuid: string
  tagList: MediaBaseTag[]
}
export interface WithUid {
  uid: string
}

export interface MediaType {
  ownerId: string
  mediaId: string
  filename: string
  ctime: Date
  mtime: Date
  contentType: string
  meta: any
}

export enum TagTargetType {
  climb = 0,
  area = 1
}

export interface XViewStateType extends ViewState{
  width: number
  height: number
  bbox: BBox
}

export interface TickType{
  _id: string
  userId: string
  name: string
  notes: string
  climbId: string
  style: string
  attemptType: string
  dateClimbed: string
  grade: string
  source: string
}

export interface UpdateDescriptionType {
  updatedFields?: string[]
  removedFields?: string[]
  truncatedArrays?: any[]
}

export interface ChangeType {
  dbOp: string
  changeId: string
  fullDocument: AreaType | ClimbType
  updateDescription: UpdateDescriptionType
}

export interface ChangesetType {
  id: string
  createdAt: number
  editedBy: string
  operation: string
  changes: ChangeType[]
}

export interface ResumeToken {
  _data: string
}

export interface ChangeRecordMetadataType {
  user: string
  operation: string
  historyId: string
  prevHistoryId?: string
  seq: number
  createdAt?: Date
  updatedAt?: Date
}

export interface FinancialBackersResponseType {
  account: {
    members: {
      nodes: FinancialBackerAccountType[]
    }
    stats: {
      totalNetAmountReceived: {
        value: number
        currency: string
      }
    }
  }
}

export interface FinancialReportType {
  totalRaised: number
  donors: FinancialBackerAccountType[]
}

export interface FinancialBackerAccountType {
  account: {
    id: string
    name: string
    imageUrl: string
  }
}

export type CountrySummaryType = Pick<AreaType, 'areaName' | 'uuid' | 'totalClimbs' | 'updatedAt' | 'metadata'> & { metadata: Pick<AreaMetadataType, 'lat' | 'lng' | 'areaId'> }

export interface TagsByUserType {
  username: string | null
  total: number
}

export interface TagsLeaderboardType {
  grandTotal: number
  list: TagsByUserType[]
}

/**
 * Validation rules for react-hook-form
 */
export type RulesType = Pick<RegisterOptions, 'minLength' | 'maxLength' | 'min' | 'max' | 'required' | 'validate'>
