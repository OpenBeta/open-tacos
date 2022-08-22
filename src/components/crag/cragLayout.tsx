import React, { useState } from 'react'
import { AreaMetadataType, Climb, CountByGroupType, MediaBaseTag } from '../../js/types'
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
  const [addedTags, setAddedTags] = useState<MediaBaseTag[]>([])

  return (
    <div className='w-full'>
      <PhotoMontage isHero photoList={[...props.media, ...addedTags]} />

      <div className='mt-8'>
        <CragSummary {...props} onTagAdded={tag => setAddedTags([...addedTags, tag])} />
      </div>

      <div className='mt-6'>
        <CragTable title='Climbs' climbs={props.climbs} />
      </div>
    </div>
  )
}
