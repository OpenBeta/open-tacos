import { useState } from 'react'

import Card from '../ui/Card/Card'
import TagList, { MobilePopupTagList } from './TagList'
import { MobileLoader } from '../../js/sirv/util'
import { MediaWithTags } from '../../js/types'
import { getUploadDateSummary } from '../../js/utils'

const MOBILE_IMAGE_MAX_WIDITH = 914

export interface MobileMediaCardProps {
  header?: JSX.Element
  mediaWithTags: MediaWithTags
  showTagActions?: boolean
  isAuthorized?: boolean
  isAuthenticated?: boolean
}

/**
 * Media card for mobile view
 */
export default function MobileMediaCard ({ header, isAuthorized = false, isAuthenticated = false, mediaWithTags }: MobileMediaCardProps): JSX.Element {
  const [localMediaWithTags, setMedia] = useState(mediaWithTags)
  const { mediaUrl, entityTags, uploadTime } = localMediaWithTags
  const tagCount = entityTags.length
  return (
    <Card
      header={header}
      image={<img
        src={MobileLoader({
          src: mediaUrl,
          width: MOBILE_IMAGE_MAX_WIDITH
        })}
        width={MOBILE_IMAGE_MAX_WIDITH}
        sizes='100vw'
             />}
      imageActions={
        <section className='flex items-center justify-between'>
          <div>&nbsp;</div>
          <MobilePopupTagList
            mediaWithTags={localMediaWithTags}
            isAuthorized={isAuthorized}
            onChange={setMedia}
          />
        </section>
      }
      body={
        <>
          <section className='-mt-2'>
            {tagCount > 0 &&
            (
              <TagList
                mediaWithTags={localMediaWithTags}
                // we have a popup for adding/removing tags
                // don't show add tag button on mobile
                showActions={false}
                isAuthorized={isAuthorized}
                isAuthenticated={isAuthenticated}
              />
            )}
          </section>
          <section className='mt-2 uppercase text-base-300 text-xs' aria-label='timestamp'>
            {getUploadDateSummary(uploadTime)}
          </section>
        </>
      }
    />
  )
}
