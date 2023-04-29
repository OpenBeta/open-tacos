import { MediaWithTags } from '../../js/types'
import UserMedia, { ImagePlaceholder } from './UserMedia'
import { ProfileATag } from '../users/PublicProfile'

interface MoreFromThisUserProps {
  loaded: boolean
  uid: string
  mediaList: MediaWithTags[]
}

export default function MoreFromThisUser ({ loaded, uid, mediaList = [] }: MoreFromThisUserProps): JSX.Element {
  return (
    <>
      <div className='block xl:grid xl:grid-cols-3 xl:gap-8 2xl:grid-cols-4 with-standard-y-margin-2x'>
        <div className='block xl:col-span-3 2xl:col-span-4 border-t border-gray-400'>
          <div className='mt-4 ml-4 lg:ml-0 font-semibold text-secondary text-lg'>
            {loaded
              ? (<><span className='tracking-tight'>More photos from</span> <ProfileATag uid={uid} /></>)
              : (<div className='h-4 w-48 bg-gray-100' />)}
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
          return (
            <UserMedia
              index={index}
              key={mediaInfo.mediaUrl}
              uid={uid}
              mediaWithTags={mediaInfo}
              isAuthorized={false}
            />
          )
        })}
      </div>
    </>

  )
}
