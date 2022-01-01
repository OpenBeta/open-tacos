
export interface AreaMetadataType {
  leaf: boolean
  lat: number
  lng: number
  left_right_index: number
  mp_id: string
  area_id: string
}

export interface ClimbMetadataType {
  lat: number
  lng: number
  left_right_index: string
  mp_id: string
  climb_id: string
}
export interface ClimbDiscipline {
  boulder: boolean
  alpine: boolean
  tr: boolean
  ice: boolean
  trad: boolean
  mixed: boolean
}

export interface Climb {
  name: string
  fa: string
  yds: string
  metadata: ClimbMetadataType
  type: ClimbDiscipline
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
