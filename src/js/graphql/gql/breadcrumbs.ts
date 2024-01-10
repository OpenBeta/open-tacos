import { gql } from '@apollo/client'
import { AreaType } from '@/js/types'
import { SortableAreaType } from '@/js/utils'

type SelectedFields = Pick<AreaType, 'uuid' | 'areaName'> & SortableAreaType

export type SiblingArea = SelectedFields

export interface AreaWithChildren extends SelectedFields {
  children: SiblingArea[]
}

export interface ChildAreasQueryReturn {
  area: AreaWithChildren
}

export const QUERY_CHILD_AREAS_FOR_BREADCRUMBS = gql`
  query ($uuid: ID) {
    area(uuid: $uuid) {
      uuid
      areaName
      children {
        uuid
        areaName
        metadata {
          areaId
          leftRightIndex
        }
      }
    }
  }
  `
