import Link from 'next/link'
import clx from 'classnames'

import Grade from '@/js/grades/Grade'
import { AreaType, Climb } from '@/js/types'
import { getClimbPageFriendlyUrl, removeTypenameFromDisciplines } from '@/js/utils'

interface NeighboringRoutesNavProps {
  climbs: Array<Climb | null>
  parentArea: AreaType
}

/**
 * Nav bar to jump to left/right sibling climb
 */
export const NeighboringRoutesNav = ({ climbs, parentArea }: NeighboringRoutesNavProps): JSX.Element => {
  return (
    <div className={clx('my-4 flex flex-row', (climbs[0] == null) ? 'justify-end' : 'justify-between')}>
      {climbs.map((climb, index) => {
        if (climb == null) { return ('') }
        const sanitizedDisciplines = removeTypenameFromDisciplines(climb.type)
        const gradeStr = new Grade(
          parentArea.gradeContext,
          climb.grades,
          sanitizedDisciplines,
          parentArea.metadata.isBoulder
        ).toString()
        return (
          <NeighboringRoute key={climb.id} climb={climb} gradeStr={gradeStr} isLeftRoute={index === 0} />
        )
      })}
    </div>
  )
}

const NeighboringRoute: React.FC<{ climb: Climb, gradeStr: String | undefined, isLeftRoute: boolean }> = ({ climb, gradeStr, isLeftRoute }) => {
  const url = getClimbPageFriendlyUrl(climb.id, climb.name)
  return (
    <Link className={clx('btn btn-lg no-animation flex items-center', isLeftRoute ? 'flex-row' : ' flex-row-reverse')} href={url}>
      {isLeftRoute ? '<' : '>'}
      <div className='hidden lg:flex flex-col gap-y-1 content-start mx-4 text-secondary'>
        <div className='text-sm'>{climb.name}</div>
        <div className='text-xs '>{gradeStr}</div>
      </div>
    </Link>
  )
}
