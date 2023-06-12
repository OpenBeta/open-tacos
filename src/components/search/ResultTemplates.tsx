import React from 'react'
import { NextRouter } from 'next/router'

import RouteCard from '../ui/RouteCard'
import { TypesenseDocumentType } from '../../js/types'
import { disciplineArrayToObj } from '../../js/utils'

interface ClimbTemplateType extends TypesenseDocumentType {
  router: NextRouter
}

interface SearchByNameTemplateProps {
  groupKey: string []
  hits: any[]
  router: NextRouter
}
/**
 * Template for rendering indiviual search result item
 * @param param0
 * @returns
 */
export const SearchByNameTemplate = ({ groupKey, hits, router }: SearchByNameTemplateProps): JSX.Element => {
  return (
    <div>
      <ClimbTypesHeader typeKeys={groupKey} />
      <div>
        {hits.map(
          ({ document }) => <ClimbTemplate key={document.id} {...document} router={router} />
        )}
      </div>
    </div>
  )
}

const ClimbTypesHeader = ({ typeKeys }: { typeKeys: string[] }): JSX.Element =>
  (
    <div className='border-b border-gray-700 my-2.5'>
      <div className='flex space-x-2'>{typeKeys.map(item =>
        (<span key={item} className='uppercase font-bold'>{item}</span>))}
      </div>
    </div>)

/**
 * How to render individual climb in search results
 *
 */
const ClimbTemplate = (props: ClimbTemplateType): JSX.Element => {
  const { climbName, climbUUID, fa, disciplines, grade, safety, router, areaNames } = props
  const url = `/climbs/${climbUUID}`
  return (
    <div className='py-2' onClick={async () => await router.push(url)}>
      <RouteCard
        routeName={climbName}
        type={disciplineArrayToObj(disciplines)}
        yds={grade}
        safety={safety}
        fa={fa}
        pathTokens={areaNames}
      />
    </div>
  )
}
