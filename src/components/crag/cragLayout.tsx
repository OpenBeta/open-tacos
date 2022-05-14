import React from 'react'
import { AreaMetadataType, Climb } from '../../js/types'
import CragSummary, { CragHeroProps } from './cragSummary'
import CragTable from './cragTable'
import NearbyCrags from './nearbyCrags'

interface CragLayoutProps extends CragHeroProps {
  climbs: Climb[]
  areaMeta: AreaMetadataType
}

export default function CragLayout (props: CragLayoutProps): JSX.Element {
  return (
    <div className='h-full  p-2'>
      <CragSummary {...props} />

      <div className='flex mt-16'>
        <div className='w-full'>
          <CragTable title='Climbs' climbs={props.climbs} />
        </div>
      </div>

      <div className='mt-8'>
        <NearbyCrags nearTo={props.areaMeta.areaId} />
      </div>
    </div>
  )
}
