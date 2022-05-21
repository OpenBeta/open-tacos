import React from 'react'
import Link from 'next/link'
import Card from './ui/Card'
import RouteTypeChips from './ui/RouteTypeChips'
import RouteGradeChip from './ui/RouteGradeChip'
import { sanitizeName } from '../js/utils'

function RandomRouteCard ({ climb }): JSX.Element | null {
  if (climb === null) return null
  const { slug, pathTokens } = climb
  const { type, route_name: routeName, safety, yds } = climb.frontmatter
  return (
    <Link href={slug} passHref>
      <a>
        <Card>
          <div className='text-left'>
            <h2 className='font-medium font-semigole font-sans text-base truncate'>
              {routeName}
            </h2>
            <div className='italic truncate text-xs text-gray-600'>
              {sanitizeName(pathTokens[pathTokens.length - 2])}
            </div>
            <div className='my-2'>
              <RouteGradeChip grade={yds} safety={safety} />
              <RouteTypeChips type={type} />
            </div>
          </div>
        </Card>
      </a>
    </Link>
  )
}

export default RandomRouteCard
