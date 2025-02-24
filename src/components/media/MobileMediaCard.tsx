import Image from 'next/image'
import Card from '../ui/Card/Card'
import TagList, { MobilePopupTagList } from './TagList'
import { MediaWithTags } from '../../js/types'
import { getUploadDateSummary } from '../../js/utils'

const MOBILE_IMAGE_MAX = 914

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
  const { mediaUrl, entityTags, uploadTime } = mediaWithTags
  const tagCount = entityTags.length
  return (
    <Card
      header={header}
      image={<Image
        src={mediaUrl}
        alt='mobile user gallery photo'
        width={MOBILE_IMAGE_MAX}
        height={MOBILE_IMAGE_MAX}
        sizes='100vw'
        className='w-full h-auto'
             />}
      imageActions={
        <section className='flex items-center justify-between'>
          <div>&nbsp;</div>
          <MobilePopupTagList
            mediaWithTags={mediaWithTags}
            isAuthorized={isAuthorized}
            // onChange={setMedia}
          />
        </section>
      }
      body={
        <>
          <section className='-mt-2'>
            {tagCount > 0 &&
            (
              <TagList
                mediaWithTags={mediaWithTags}
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
