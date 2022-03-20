import React from 'react'
import Link from 'next/link'
import { sanitizeName } from '../../js/utils'
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
    <div>
      <Link href='/'>
        <a className='hover:underline hover:text-gray-900 text-gray-400 '>Home</a>
      </Link>

      {pathTokens.map((place, index, array) => {
        const isLastElement = array.length - 1 === index
        const path = ancestors[index]
        const url = `/areas/${path}`
        const climbPageLastUrl = `/crag/${path}`
        return (
          <span key={index}>
            <span className='text-secondary mx-1.5'>/</span>
            {/* last element but not currently on the climb page */}
            {isLastElement && !isClimbPage && <span className=''>{sanitizeName(place)}</span>}

            {/* last element and currently on the climb page, so /crag/ url used */}
            {isLastElement && isClimbPage &&
              <span className='text-secondary'>
                <Link href={climbPageLastUrl}>
                  <a className='hover:underline hover:text-gray-900'>
                    {sanitizeName(place)}
                  </a>
                </Link>
              </span>}

            {/* all links before last element when on climb page to get /areas/ url */}
            {!isLastElement && isClimbPage &&
              <span className='text-secondary'>
                <Link href={url}>
                  <a className='hover:underline hover:text-gray-900'>{sanitizeName(place)}</a>
                </Link>
              </span>}
          </span>
        )
      })}
    </div>
  )
}

export interface MiniBreadCrumbsProps {
  pathTokens: string[]
  end?: number // how many levels of ancestor to disply
}

const SEPARATOR = ' \u25BB '

export const MiniCrumbs = ({ pathTokens, end = 2 }: MiniBreadCrumbsProps): JSX.Element => {
  const tokens = [pathTokens.slice(1, 2)[0] + ' ...', ...pathTokens.slice(pathTokens.length - end)].map(sanitizeName)
  return (
    <div className='pb-2 font-semibold text-xs text-secondary'>{tokens.join(SEPARATOR)}</div>
  )
}

export default BreadCrumbs
