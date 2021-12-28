import React from 'react'
import { Link } from 'gatsby'
import { sanitizeName } from '../../js/utils'
const slugify = require('slugify')

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
function BreadCrumbs ({ pathTokens, isClimbPage }) {
  const tokens = isClimbPage
    ? pathTokens.slice(0, pathTokens.length - 1)
    : pathTokens
  return (
    <div className='mt-4'>
      <Link className='hover:underline hover:text-gray-900 text-gray-400 ' to='/'>
        <b>Home</b>
      </Link>
      {tokens.map((place, index, array) => {
        const isLastElement = array.length - 1 === index
        const url = '/' + slugifyPath(array.slice(0, index + 1))
        return (
          <span key={index}>
            <span className='text-gray-400 mx-1.5'>/</span>
            {isLastElement && !isClimbPage
              ? (
                <span className=''>{sanitizeName(place)}</span>
                )
              : (
                <span className='text-gray-400'>
                  <Link className='hover:underline hover:text-gray-900' to={url}>
                    {sanitizeName(place)}
                  </Link>
                </span>
                )}
            {/* {!isLastElement && <span className="text-gray-400 mx-1.5">/</span>} */}
          </span>
        )
      })}
    </div>
  )
}

const slugifyPath = (pathTokens) =>
  pathTokens.map((s) => slugify(s, { lower: true, strict: true })).join('/')

export default BreadCrumbs
