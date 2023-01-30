import React from 'react'
import { AreaMetadataType, AreaType, Climb, CountByGroupType } from '../../js/types'
import PhotoMontage from '../media/PhotoMontage'
import CragSummary, { CragHeroProps } from './cragSummary'
import { UploadCTACragBanner } from '../media/UploadCTA'

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
  const { media: photoList, uuid } = props
  console.log('##craglayout', uuid, photoList)
  return (
    <div className='w-full mb-16'>
      <PhotoMontage isHero key={`${uuid}${photoList.length}`} photoList={photoList} />
      {photoList.length === 0 && <UploadCTACragBanner />}
      <div className='mt-6 first:mt-0'>
        <CragSummary {...props} key={props.uuid} />
      </div>
    </div>
  )
}
