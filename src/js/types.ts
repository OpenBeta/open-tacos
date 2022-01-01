
export interface AreaMetadataType {
  isLeaf: boolean
  lat: number
  lng: number
  left_right_index: number
  mp_id: string
  area_id: string
}

export interface ClimbMetadataType {
  lat: number
  lng: number
  left_right_index: number
  mp_id: string
  climb_id: string
}

export interface Climb {
  name: string
  fa: string
  yds: string
  metadata: ClimbMetadataType
  content: {
    description: string
    location: string
    protection: string
  }
}

export interface AreaType {
  area_name: string
  metadata: AreaMetadataType
  content: {
    description: string
  }
  climbs: Climb
}

export interface ResponseType {
  areas: AreaType[]
}
