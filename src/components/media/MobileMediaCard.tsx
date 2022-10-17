
import Card from '../ui/Card/Card'
import TagList, { MobilePopupTagList } from './TagList'
import { MobileLoader } from '../../js/sirv/util'
import { MediaType, MediaTagWithClimb } from '../../js/types'
import { getUploadDateSummary } from '../../js/utils'

const MOBILE_IMAGE_MAX_WIDITH = 914
interface MobileMediaCardProps {
  imageInfo: MediaType
  tagList: MediaTagWithClimb[]
  isAuthorized?: boolean
  isAuthenticated?: boolean
}

export default function MobileMediaCard ({ isAuthorized = false, isAuthenticated = false, imageInfo, tagList }: MobileMediaCardProps): JSX.Element {
  return (
    <Card
      image={<img
        src={MobileLoader({
          src: imageInfo.filename,
          width: MOBILE_IMAGE_MAX_WIDITH
        })}
        width={MOBILE_IMAGE_MAX_WIDITH}
        sizes='100vw'
             />}
      imageActions={
        <section className='flex items-center justify-between'>
          <div>&nbsp;</div>
          <MobilePopupTagList imageInfo={imageInfo} list={tagList} isAuthorized={isAuthorized} />
        </section>
      }
      body={
        <>
          <section className='-mt-2'>
            {tagList?.length > 0 &&
            (
              <TagList
                list={tagList}
                isAuthorized={isAuthorized}
                isAuthenticated={isAuthenticated}
                imageInfo={imageInfo}
              />
            )}
          </section>
          <section className='mt-2 uppercase text-base-300' aria-label='timestamp'>
            {getUploadDateSummary(imageInfo.ctime)}
          </section>
        </>
      }
    />
  )
}
