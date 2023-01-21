import React from 'react'
import { AreaMetadataType, AreaType, Climb, CountByGroupType } from '../../js/types'
import PhotoMontage from '../media/PhotoMontage'
import CragSummary, { CragHeroProps } from './cragSummary'

export type AreaSummaryType = Pick<AreaType, 'uuid' | 'areaName' | 'climbs' | 'children' | 'totalClimbs'> & { metadata: Pick<AreaType['metadata'], 'leaf' | 'isBoulder' | 'isDestination'> }
export interface CragLayoutProps extends CragHeroProps {
  climbs: Climb[]
  childAreas: AreaSummaryType []
  areaMeta: AreaMetadataType
  pathTokens: string[]
  ancestors: string[]
  aggregate: CountByGroupType[]
}

export default function CragLayout (props: CragLayoutProps): JSX.Element {
  return (
    <div className='w-full mb-16'>
      <PhotoMontage isHero photoList={props.media} />
      <div className='mt-6 first:mt-0'>
        <CragSummary {...props} key={props.uuid} />
      </div>
    </div>
  )
}
