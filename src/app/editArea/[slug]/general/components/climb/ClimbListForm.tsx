import Link from 'next/link'
import clx from 'classnames'
import { AreaMetadataType, ClimbDisciplineRecord, ClimbType } from '@/js/types'
import { disciplineTypeToDisplay } from '@/js/grades/util'
import { removeTypenameFromDisciplines } from '@/js/utils'
import Grade, { GradeContexts } from '@/js/grades/Grade'

export const ClimbList: React.FC<{ gradeContext: GradeContexts, climbs: ClimbType[], areaMetadata: AreaMetadataType }> = ({ gradeContext, climbs, areaMetadata }) => {
  return (
    // it looks better
    <ol className={clx(climbs.length < 5 ? 'block max-w-sm' : 'three-column-table', 'divide-y divide-base-200')}>
      {climbs.map((climb, index) => {
        return (
          <ClimbRow
            key={climb.id}
            gradeContext={gradeContext}
            areaMetadata={areaMetadata}
            {...climb}
            index={index + 1}
          />
        )
      })}
    </ol>
  )
}

const ClimbRow: React.FC<ClimbType & { index: number, gradeContext: GradeContexts, areaMetadata: AreaMetadataType }> = ({ id, name, type: disciplines, index, gradeContext, grades, areaMetadata }) => {
  const sanitizedDisciplines = removeTypenameFromDisciplines(disciplines)
  const gradeStr = new Grade(
    gradeContext,
    grades,
    sanitizedDisciplines,
    areaMetadata.isBoulder
  ).toString()
  const url = `/climb/${id}`
  return (
    <li className='py-2 break-inside-avoid-column break-inside-avoid'>
      <Link href={url} className='flex gap-x-4 flex-nowrap'>
        <ListBullet index={index} disciplines={disciplines} />
        <div className='w-full'>
          <div className='flex justify-between'>
            <div className='text-base font-semibold uppercase tracking-tight hover:underline'>{name}</div>
            <div>{gradeStr}</div>
          </div>
          <div><DisciplinesInfo disciplines={disciplines} /></div>
        </div>
      </Link>
    </li>
  )
}

const ListBullet: React.FC<{ index: number, disciplines: ClimbDisciplineRecord }> = (
  { index, disciplines }) => {
  const strictlySport = (disciplines?.sport ?? false) &&
    !((disciplines?.trad ?? false) || (disciplines?.aid ?? false))
  return (
    <div className='mt-1'>
      <div className={
        clx('rounded-full h-6 w-6 grid place-content-center text-sm text-neutral-content',
          strictlySport ? 'bg-sport-climb-cue' : 'bg-neutral')
        }
      >
        {index}
      </div>
    </div>
  )
}

const DisciplinesInfo: React.FC<{ disciplines: Partial<ClimbDisciplineRecord> }> = ({ disciplines }) => {
  const tokens = disciplineTypeToDisplay(disciplines)
  return (
    <div className={clx('text-secondary text-xs', tokens.length === 0 ? 'italic text-error' : '')}>
      {tokens.length === 0 ? 'Disciplines not set' : tokens.join(' · ')}
    </div>
  )
}
