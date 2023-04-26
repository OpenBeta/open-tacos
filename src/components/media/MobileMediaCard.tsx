
import Card from '../ui/Card/Card'
import TagList, { MobilePopupTagList } from './TagList'
import { MobileLoader } from '../../js/sirv/util'
import { HybridMediaTag } from '../../js/types'
import { getUploadDateSummary } from '../../js/utils'

const MOBILE_IMAGE_MAX_WIDITH = 914

interface MobileMediaCardProps {
  header?: JSX.Element
  tagList: HybridMediaTag[]
  showTagActions?: boolean
  isAuthorized?: boolean
  isAuthenticated?: boolean
}

export default function MobileMediaCard ({ header, showTagActions = false, isAuthorized = false, isAuthenticated = false, tagList }: MobileMediaCardProps): JSX.Element {
  return (
    <Card
      header={header}
      image={<img
        src={MobileLoader({
          src: tagList[0].mediaUrl,
          width: MOBILE_IMAGE_MAX_WIDITH
        })}
        width={MOBILE_IMAGE_MAX_WIDITH}
        sizes='100vw'
             />}
      imageActions={
        <section className='flex items-center justify-between'>
          <div>&nbsp;</div>
          <MobilePopupTagList list={tagList} isAuthorized={isAuthorized} />
        </section>
      }
      body={
        <>
          <section className='-mt-2'>
            {tagList?.length > 0 &&
            (
              <TagList
                list={tagList}
                showActions={showTagActions}
                isAuthorized={isAuthorized}
                isAuthenticated={isAuthenticated}
                tagSource={tagList[0]}
              />
            )}
          </section>
          <section className='mt-2 uppercase text-base-300 text-xs' aria-label='timestamp'>
            {getUploadDateSummary(tagList[0].birthTime)}
          </section>
        </>
      }
    />
  )
}

// interface RecentImageCardProps {
//   header?: JSX.Element
//   imageInfo: MediaType
//   tagList: HybridMediaTag[]
// }

// export const RecentImageCard = ({ header, imageInfo, tagList }: RecentImageCardProps): JSX.Element => {
//   return (
//     <Card
//       header={<div />}
//       image={
//         <img
//           src={MobileLoader({
//             src: imageInfo.filename,
//             width: MOBILE_IMAGE_MAX_WIDITH
//           })}
//           width={MOBILE_IMAGE_MAX_WIDITH}
//           sizes='100vw'
//         />
// }
//       body={
//         <>
//           <section className='flex flex-col gap-y-4'>
//             <TagList
//               list={tagList}
//               showActions={false}
//               isAuthorized={false}
//               isAuthenticated={false}
//               imageInfo={imageInfo}
//             />
//             <div className='uppercase text-xs text-base-200'>
//               {getUploadDateSummary(imageInfo.ctime)}
//             </div>

//           </section>
//         </>
// }
//     />
//   )
// }
