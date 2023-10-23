import Link from 'next/link'
import Image from 'next/image'

import {
  UserCircleIcon
} from '@heroicons/react/24/outline'

import { getMediaForFeed } from '@/js/graphql/api'
import { MobileLoader } from '@/js/sirv/util'

const MAX_PREVIEW_WIDTH = 100
/**
 *
 * @returns
 */
export const RecentTags: React.FC = async () => {
  const recentTagsByUsers = await getMediaForFeed(20, 4)

  return (
    <div className='w-full bg-base-300 py-8'>
      <section className=''>
        <h2 className='text-base-100'>Recent Tags</h2>
        <hr className='mb-6 border-2 border-base-content' />
        <div className='max-w-fit overflow-x-auto'>
          <div className='flex flex-row flex-nowrap gap-x-6 max-w-fit'>
            {recentTagsByUsers.map(user => {
              const { userUuid, username, mediaWithTags } = user
              return (
                <div key={userUuid} className='card bg-base-100 shadow-xl'>
                  <div className='flex flex-wrap w-64'>{mediaWithTags.map(media => {
                    const { mediaUrl, id, width, height } = media
                    const imageRatio = width / height
                    return (
                      <div key={id} className='overflow-hidden relative aspect-square w-32 h-32'>
                        <Image
                          src={MobileLoader({
                            src: mediaUrl,
                            width: MAX_PREVIEW_WIDTH
                          })}
                          width={MAX_PREVIEW_WIDTH}
                          height={MAX_PREVIEW_WIDTH / imageRatio}
                          sizes='100px'
                          objectFit='cover'
                          className='w-32 h-32'
                        // style={{ width: 64, height: 64 }}
                          alt=''
                        />
                      </div>
                    )
                  })}
                  </div>
                  <div className='card-body'>
                    <div className='card-actions'>
                      <Link href={`/u/${username}`} className='flex items-center gap-2'><UserCircleIcon className='w-6 h-6' /> {username}</Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
