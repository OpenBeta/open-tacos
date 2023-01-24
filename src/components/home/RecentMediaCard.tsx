import Link from 'next/link'
import Card from '../ui/Card/Card'
import TagList from '../media/TagList'
import { MobileLoader } from '../../js/sirv/util'
import { MediaType, HybridMediaTag } from '../../js/types'
import { getUploadDateSummary, urlResolver } from '../../js/utils'
import { PostHeader } from './Post'

const MOBILE_IMAGE_MAX_WIDITH = 914

interface RecentImageCardProps {
  header?: JSX.Element
  imageInfo: MediaType
  tagList: HybridMediaTag[]
}

export const RecentImageCard = ({ imageInfo, tagList }: RecentImageCardProps): JSX.Element => {
  const { mediaType, destination } = tagList[0]
  const firstUrl = urlResolver(mediaType, destination) ?? '#'
  return (
    <Card
      header={<PostHeader username={tagList[0].uid} />}
      image={
        <Link href={firstUrl}>
          <a>
            <img
              src={MobileLoader({
                src: imageInfo.filename,
                width: MOBILE_IMAGE_MAX_WIDITH
              })}
              width={MOBILE_IMAGE_MAX_WIDITH}
              sizes='100vw'
            />
          </a>
        </Link>
      }
      body={
        <>
          <section className='flex flex-col gap-y-4'>
            <TagList
              list={tagList}
              showActions={false}
              isAuthorized={false}
              isAuthenticated={false}
              imageInfo={imageInfo}
            />
            <div className='uppercase text-xs text-base-200'>
              {getUploadDateSummary(imageInfo.ctime)}
            </div>

          </section>
        </>
}
    />
  )
}
