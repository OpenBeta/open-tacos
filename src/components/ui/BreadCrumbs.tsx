import React from 'react'
import Link from 'next/link'
import clx from 'classnames'

import { getAreaPageFriendlyUrl, sanitizeName } from '../../js/utils'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { TypesenseAreaType } from '../../js/types'

/**
 * Turn each element of `pathTokens` to a gatsby-link.
 *
 * Example:
 * ```
 * pathTokens = ["USA", "Nevada", "Area 51", "Ladder1"]
 * isClimbPage = true
 *   => USA / Nevada / Area 51
 * isClimbPage = false
 *   => USA / Nevada / Area 51 / Ladder1
 * ```
 * @param {{pathTokens:string[], isClimbPage:boolean}} Props component props
 */
interface BreakCrumbsProps {
  pathTokens: string[]
  ancestors: string[]
  isClimbPage?: boolean
}

/**
 * @deprecated
 */
function BreadCrumbs ({ pathTokens, ancestors, isClimbPage = false }: BreakCrumbsProps): JSX.Element {
  return (
    <div aria-label='area-breadcrumbs' className='inline-flex flex-wrap gap-2 text-sm items-center text-base-300 tracking-tight'>
      <Link href='/a' className='inline-flex items-center gap-2'>

        <GlobeAltIcon className='inline w-5 h-5' />
        <span className='hover:underline mt-0.5'>Home</span>

      </Link>

      {pathTokens.map((place, index, array) => {
        const isLastElement = array.length - 1 === index
        const path = ancestors[index]
        const url = `/crag/${path}`
        return (
          <React.Fragment key={`bread-${index}`}>
            <span className='text-xs mt-0.5'>/</span>
            <span className='text-base-300 mt-0.5'>
              {
                isLastElement && !isClimbPage
                  ? (<span className='font-semibold'>{sanitizeName(place)}</span>)
                  : (
                      (
                        <Link href={url} className='hover:underline whitespace-nowrap'>
                          {sanitizeName(place)}
                        </Link>)
                    )
              }
            </span>
          </React.Fragment>
        )
      })}
    </div>
  )
}
export default BreadCrumbs

export interface MiniBreadCrumbsProps {
  pathTokens: string[]
  skipLast?: boolean
}

const SEPARATOR = ' / '

/**
 * Smaller breadcrumbs
 * Nov 11, 2022: This component used to shorten (remove)
 * some items in the middle of the list.  It's buggy when
 * there are fewer than 4 items.
 * @param MiniBreadCrumbsProps
 */
export const MiniCrumbs = ({ pathTokens, skipLast = false }: MiniBreadCrumbsProps): JSX.Element => {
  const subArrayCount = skipLast ? pathTokens.length - 1 : undefined
  return (
    <div
      aria-label='area-minicrumbs'
      className='text-xs text-base-300'
    >{pathTokens.slice(0, subArrayCount).map(sanitizeName).join(SEPARATOR)}
    </div>
  )
}

type TextOnlyCrumbsProps = Pick<TypesenseAreaType, 'pathTokens' | 'highlightIndices'>

/**
 * MiniCrumbs was buggy at the time so I created another one from
 * scratch.  We should combine the two.
 */
export const TextOnlyCrumbs = ({ pathTokens, highlightIndices }: TextOnlyCrumbsProps): JSX.Element => {
  const shouldHighlight = (index: number): boolean => highlightIndices.some(element => element === index) ?? false
  return (
    <div
      aria-label='area-minicrumbs'
      className='text-sm flex flex-wrap'
    >
      {pathTokens.map((path, index) => (
        <React.Fragment key={`${path}${index}`}>
          <Item highlight={shouldHighlight(index)} path={path} current={index} length={pathTokens.length} />
        </React.Fragment>
      ))}
    </div>
  )
}

interface ItemProps {
  path: string
  highlight: boolean
  current: number
  length: number
}
const Item = ({ path, highlight, current, length }: ItemProps): JSX.Element => (

  <span className={clx('flex items-center', highlight ? 'font-bold' : 'text-base-300')}>
    {sanitizeName(path)}
    {current < length - 1 ? <span className='text-base-300 px-1'>{SEPARATOR}</span> : null}
  </span>)

/**
 * Area path crumbs based on DaisyUI. `editMode = true` lets users remain in edit mode when navigating to other areas.
 */
export const GluttenFreeCrumbs: React.FC<{
  pathTokens: string[]
  ancestors: string[]
  editMode?: boolean
}> = ({ pathTokens, ancestors, editMode = false }) => {
  return (
    <div className='breadcrumbs text-sm font-medium text tracking-tight'>
      <ul>
        <li><a href='/' className='text-secondary'>Home</a></li>
        {pathTokens.map((path, index) => {
          const uuid = ancestors[index]
          const url = editMode ? `/editArea/${uuid}` : getAreaPageFriendlyUrl(uuid, path)
          return <GFItem key={uuid} path={sanitizeName(path)} url={url} isLast={index === pathTokens.length - 1} />
        })}
      </ul>
    </div>
  )
}

/**
 * Individual crumb.
 * Todo:  display entity icon with the last item
 */
const GFItem: React.FC<{ path: string, url: string, isLast: boolean }> =
  ({ path, url, isLast }) => (
    <li>
      <a
        href={url}
        className={clx(
          isLast ? 'text-primary font-semibold badge badge-info' : 'text-secondary')}
      >
        {path}
      </a>
    </li>
  )
