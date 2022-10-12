import { PlusIcon } from '@heroicons/react/solid'

import Card from '../ui/Card/Card'
import AddTag from './AddTag'
import TagList, { MenuItems } from './TagList'
// import MobileTagTrigger from './MobileTagTrigger'
import { MobileLoader } from '../../js/sirv/util'
import { MediaType, MediaTagWithClimb } from '../../js/types'
import { getUploadDateSummary } from '../../js/utils'

const MOBILE_IMAGE_MAX_WIDITH = 914
interface MobileMediaCardProps {
  imageInfo: MediaType
  // onTagDeleted: (props?: any) => void
  tagList: MediaTagWithClimb[]
  isAuthorized?: boolean
}

export default function MobileMediaCard ({ isAuthorized, imageInfo, tagList }: MobileMediaCardProps): JSX.Element {
  return (
    <Card
      // header='header'
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
          <MenuItems list={tagList} isAuthorized={isAuthorized} />
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
              >
                <AddTag
                  imageInfo={imageInfo}
                  label={<div className='badge gap-1'><PlusIcon className='w-4 h-4 inline-block' /> New tag</div>}
                />
              </TagList>)}
          </section>
          <section className='mt-2 uppercase text-base-300'>
            {getUploadDateSummary(imageInfo.ctime)}
          </section>
        </>
}
    />
  )
}