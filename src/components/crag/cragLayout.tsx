import React from 'react'
import { AreaMetadataType, Climb, CountByGroupType } from '../../js/types'
import PhotoMontage from '../media/PhotoMontage'
import CragSummary, { CragHeroProps } from './cragSummary'
import CragTable from './cragTable'

interface CragLayoutProps extends CragHeroProps {
  climbs: Climb[]
  areaMeta: AreaMetadataType
  pathTokens: string[]
  ancestors: string[]
  aggregate: CountByGroupType[]
}

export default function CragLayout (props: CragLayoutProps): JSX.Element {
  return (
    <div className='w-full'>
      <PhotoMontage isHero photoList={props.media} />

      <div className='mt-8'>
        <CragSummary {...props} />
      </div>

      <div className='mt-6'>
        <CragTable title='Climbs' climbs={props.climbs} />
      </div>
    </div>
  )
}
