import Link from 'next/link'
import { basename } from 'path'

import { MediaType } from '../../js/types'
import UserMedia, { ImagePlaceholder } from './UserMedia'
import { ProfileATag } from '../users/PublicProfile'

interface MoreFromThisUserProps {
  loaded: boolean
  uid: string
  mediaList?: MediaType[]
}

export default function MoreFromThisUser ({ loaded, uid, mediaList = [] }: MoreFromThisUserProps): JSX.Element {
  return (
    <>
      <div className='block xl:grid xl:grid-cols-3 xl:gap-8 2xl:grid-cols-4 with-standard-y-margin'>
        <div className='block xl:col-span-3 2xl:col-span-4 border-t'>
          <div className='mt-4 ml-4 lg:ml-0 font-semibold text-secondary text-lg'>
            {loaded
              ? (<>More photos from <ProfileATag uid={uid} /></>)
              : (<div className='h-4 w-48 bg-gray-200' />)}
          </div>
        </div>
        {!loaded && (
          <>
            <ImagePlaceholder uniqueKey='more-1' />
            <ImagePlaceholder uniqueKey='more-2' />
            <ImagePlaceholder uniqueKey='more-3' />
            <ImagePlaceholder uniqueKey='more-4' />
          </>)}
        {mediaList.map((mediaInfo, index) => {
          const tags = []
          const shareableUrl = `/u/${uid}/${basename(mediaInfo.filename)}`
          return (
            <Link
              as={shareableUrl}
              key={index}
              href={shareableUrl}
              prefetch={false}
            >
              <a>
                <UserMedia
                  index={index}
                  key={mediaInfo.mediaId}
                  uid={uid}
                  tagList={tags}
                  imageInfo={mediaInfo}
                  onTagDeleted={NoOP}
                  isAuthorized={false}
                />
              </a>
            </Link>
          )
        })}
      </div>
    </>

  )
}

const NoOP = (event): void => {
  event.preventDefault()
}
