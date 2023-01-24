import Link from 'next/link'
import Card from '../ui/Card/Card'
import TagList from '../media/TagList'
import { MobileLoader } from '../../js/sirv/util'
import { MediaType, HybridMediaTag } from '../../js/types'
import { getUploadDateSummary } from '../../js/utils'
import { PostHeader } from './Post'
import { resolver as urlResolver } from '../media/Tag'

const MOBILE_IMAGE_MAX_WIDITH = 914

interface RecentImageCardProps {
  header?: JSX.Element
  imageInfo: MediaType
  tagList: HybridMediaTag[]
}

/**
 * Image card for the home page
 */
export const RecentImageCard = ({ imageInfo, tagList }: RecentImageCardProps): JSX.Element => {
  const [firstUrl] = urlResolver(tagList[0])
  return (
    <Card
      header={<PostHeader username={tagList[0].uid} />}
      image={
        <Link href={firstUrl ?? '#'}>
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
          <section className='flex flex-col gap-y-4 justify-between'>
            <TagList
              list={tagList}
              showActions={false}
              isAuthorized={false}
              isAuthenticated={false}
              imageInfo={imageInfo}
            />
            <span className='uppercase text-xs text-base-200'>
              {getUploadDateSummary(imageInfo.ctime)}
            </span>

          </section>
        </>
}
    />
  )
}
