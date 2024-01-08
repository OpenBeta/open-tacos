import clx from 'classnames'
import Link from 'next/link'

import { getAreaPageFriendlyUrl, sanitizeName } from '@/js/utils'
import { SiblingAreasCrumb } from './SiblingAreasCrumb'

/**
 * Area path crumbs based on DaisyUI. `editMode = true` lets users remain in edit mode when navigating to other areas.
 */
export const AreaCrumbs: React.FC<{
  pathTokens: string[]
  ancestors: string[]
  editMode?: boolean
}> = ({ pathTokens, ancestors, editMode = false }) => {
  return (
    <div className='breadcrumbs text-sm font-medium'>
      <ul>
        <li><a href='/' className='text-secondary'>Home</a></li>
        {pathTokens.map((path, index) => {
          const uuid = ancestors[index]
          const url = makeUrl(editMode, uuid, path)
          return (
            <SiblingAreasCrumb key={uuid} pathTokens={pathTokens} ancestors={ancestors} currentIndex={index} editMode={editMode}>
              <AreaItem path={sanitizeName(path)} url={url} isLast={index === pathTokens.length - 1} />
            </SiblingAreasCrumb>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * Individual crumb.
 * Todo:  display entity icon with the last item
 */
const AreaItem: React.FC<{ path: string, url: string, isLast: boolean }> = ({ path, url, isLast }) => (
  <li className='no-underline'>
    <Link
      prefetch={false}
      href={url}
      className={clx('tracking-tight',
        isLast ? 'text-primary font-semibold badge badge-info' : 'text-secondary font-normal')}
    >
      {path}
    </Link>
  </li>
)

export const makeUrl = (editMode: boolean, uuid: string, path: string): string => {
  return editMode ? `/editArea/${uuid}` : getAreaPageFriendlyUrl(uuid, path)
}
