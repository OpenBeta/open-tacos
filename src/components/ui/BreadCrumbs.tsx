import React from 'react'
import Link from 'next/link'
import { sanitizeName } from '../../js/utils'
import { MapPinIcon } from '@heroicons/react/24/outline'
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

function BreadCrumbs ({ pathTokens, ancestors, isClimbPage = false }: BreakCrumbsProps): JSX.Element {
  return (
    <div aria-label='area-breadcrumbs' className='flex-wrap flex gap-2 text-sm items-center'>
      <MapPinIcon className='text-ob-primary w-5 h-5' />

      <Link href='/a'>
        <a className='hover:underline hover:text-base-content text-base-300'>Home</a>
      </Link>

      {pathTokens.map((place, index, array) => {
        const isLastElement = array.length - 1 === index
        const path = ancestors[index]
        const url = `/areas/${path}`
        const climbPageLastUrl = `/crag/${path}`

        return (
          <React.Fragment key={`bread-${index}`}>
            <span className='text-xs'>/</span>
            <span className='text-base-300'>
              {(isLastElement && !isClimbPage && <span className='text-ob-primary'>{sanitizeName(place)}</span>) ||
            (
              <Link href={isLastElement && isClimbPage ? climbPageLastUrl : url}>
                <a className='hover:underline hover:text-base-content whitespace-nowrap'>
                  {sanitizeName(place)}
                </a>
              </Link>
            )}
            </span>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export interface MiniBreadCrumbsProps {
  pathTokens: string[]
  end?: number // number of immediate ancestors to disply
  skipLast?: boolean
}

const SEPARATOR = ' / '

/**
 * Show small and truncated breadcrumbs by trimming items in the middle
 * @param MiniBreadCrumbsProps
 */
export const MiniCrumbs = ({ pathTokens, end = 2, skipLast = false }: MiniBreadCrumbsProps): JSX.Element => {
  const tokens = [
    pathTokens.slice(1, 2)[0] + ' ...',
    ...pathTokens.slice(pathTokens.length - end, skipLast ? pathTokens.length - 1 : undefined)
  ].map(sanitizeName)
  return (
    <div
      aria-label='area-minicrumbs'
      className='text-xs text-base-300'
    >{tokens.join(SEPARATOR)}
    </div>
  )
}

export default BreadCrumbs
