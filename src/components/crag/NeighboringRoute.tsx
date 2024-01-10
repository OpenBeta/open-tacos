import Grade from '@/js/grades/Grade'
import { AreaType, Climb } from '@/js/types'
import { removeTypenameFromDisciplines } from '@/js/utils'

import clx from 'classnames'

interface NeighboringRoutesNavProps {
  climbs: Array<Climb | null>
  parentArea: AreaType
}

export const NeighboringRoutesNav = ({ climbs, parentArea }: NeighboringRoutesNavProps): JSX.Element => {
  return (
    <div className={clx('flex flex-row', (climbs[0] == null) ? 'justify-end' : 'justify-between')}>
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
  const url = `/climbs/${climb.id}`
  const strictlySport = (climb.type?.sport ?? false) &&
    !((climb.type?.trad ?? false) || (climb.type?.aid ?? false))
  return (
    <a className={clx('flex items-center', isLeftRoute ? 'flex-row' : ' flex-row-reverse')} href={url}>
      <div className={
                clx('rounded-full h-6 w-6 grid place-content-center text-sm text-neutral-content flex-shrink-0',
                  strictlySport ? 'bg-sport-climb-cue' : 'bg-neutral')
            }
      >
        {isLeftRoute ? '<' : '>'}
      </div>
      <div className='flex flex-col content-start ml-4 mr-4'>
        <div>{climb.name}</div>
        <div className='text-xs '>{gradeStr}</div>
      </div>
    </a>
  )
}
