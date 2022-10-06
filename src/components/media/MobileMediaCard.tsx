import { PlusIcon } from '@heroicons/react/solid'

import Card from '../ui/Card/Card'
import ClimbSearchForTagging from '../search/ClimbSearchForTagging'
import TagList from './TagList'
import { MobileLoader } from '../../js/sirv/util'
import { MediaType, MediaTagWithClimb } from '../../js/types'
import { getUploadDateSummary } from '../../js/utils'

const MOBILE_IMAGE_MAX_WIDITH = 914
interface MobileMediaCardProps {
  imageInfo: MediaType
  onTagDeleted: (props?: any) => void
  tagList: MediaTagWithClimb[]
  isAuthorized?: boolean
}

export default function MobileMediaCard ({ isAuthorized, imageInfo, onTagDeleted, tagList }: MobileMediaCardProps): JSX.Element {
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
          <div>
            <ClimbSearchForTagging onSelect={doc => console.log(doc)} />
          </div>
        </section>
      }
      body={
        <>
          <section className='-mt-4 flex items-stretch gap-x-2'>
            {tagList?.length > 0 && <TagList
              hovered={false}
              list={tagList}
              onDeleted={onTagDeleted}
              isAuthorized={isAuthorized}
            //   className='px-2'
                                    />}
            <ClimbSearchForTagging label={<div className='badge gap-1'><PlusIcon className='w-4 h-4 inline-block' /> New tag</div>} onSelect={doc => console.log(doc)} />
          </section>
          <section className='mt-2 uppercase text-base-300'>
            {getUploadDateSummary(imageInfo.ctime)}
          </section>
        </>
}
    />
  )
}
