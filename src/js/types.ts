
export interface AreaMetadataType {
  leaf: boolean
  lat: number
  lng: number
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

type ClimbDiscipline = 'boulder' | 'alpine' | 'tr' | 'ice' | 'trad' | 'mixed'

export type ClimbDisciplineRecord = Record<ClimbDiscipline, boolean>

export interface Climb {
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
}

export interface AreaType {
  area_name: string
  pathTokens: string[]
  metadata: AreaMetadataType
  ancestors: string[]
  content: {
    description: string
  }
  children: AreaType[]
  climbs: Climb[]
}

export interface AreaResponseType {
  areas: AreaType[]
}

export interface ClimbResponseType {
  climbs: Climb[]
}
