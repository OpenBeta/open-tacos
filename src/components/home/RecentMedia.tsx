import { groupBy } from 'underscore'

import { MediaByAuthor } from '../../js/types'
import { SIRV_CONFIG } from '../../js/sirv/SirvClient'
interface Props {
  list: MediaByAuthor[]
}
export default function RecentMedia ({ list }: Props): JSX.Element {
  console.log('#recent', list)
  const tags = list?.flatMap(entry => entry.tagList.slice(0, 10))
  const tagsByPhoto = groupBy(tags, 'mediaUrl')

  console.log(tagsByPhoto)

  return (
    <div className='gap-4 columns-1 md:px-4 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-6'>
      {Object.entries(tagsByPhoto).map(([key, entry]) => {
        return (
          <div key={key} className='mb-4 rounded-md overflow-hidden'>
            <img src={`${SIRV_CONFIG.baseUrl}/${key}`} />
            {/* <div>{authorUuid}</div> */}
          </div>
        )
      })}
    </div>
  )
}
