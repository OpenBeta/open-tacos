import clx from 'classnames'
import { AreaMetadataType, ClimbDisciplineRecord, ClimbType } from '@/js/types'
import { disciplineTypeToDisplay } from '@/js/grades/util'
import { removeTypenameFromDisciplines } from '@/js/utils'
import Grade, { GradeContexts } from '@/js/grades/Grade'
import { ClimbListMiniToolbar } from '../../../manageClimbs/components/ClimbListMiniToolbar'

const leftRightIndexComparator = (a: ClimbType, b: ClimbType): number => {
  const aIndex = a.metadata.leftRightIndex
  const bIndex = b.metadata.leftRightIndex
  if (aIndex < bIndex) return -1
  else if (aIndex > bIndex) return 1
  return 0
}

export const ClimbList: React.FC<{ gradeContext: GradeContexts, climbs: ClimbType[], areaMetadata: AreaMetadataType, editMode: boolean }> = ({ gradeContext, climbs, areaMetadata, editMode }) => {
  const sortedClimbs = climbs.sort(leftRightIndexComparator)
  return (
    <div>
      {climbs.length === 0 && <div className='alert alert-info text-sm'>No climbs found.  Use the form below to add new climbs.</div>}
      <ol className={clx(climbs.length < 5 ? 'block max-w-sm' : 'three-column-table', 'divide-y divide-base-200')}>
        {sortedClimbs.map((climb, index) => {
          return (
            <ClimbRow
              key={climb.id}
              gradeContext={gradeContext}
              areaMetadata={areaMetadata}
              {...climb}
              index={index + 1}
              editMode={editMode}
            />
          )
        })}
      </ol>
    </div>
  )
}

const ClimbRow: React.FC<ClimbType & { index: number, gradeContext: GradeContexts, areaMetadata: AreaMetadataType, editMode?: boolean }> = ({ id, name, type: disciplines, index, gradeContext, grades, areaMetadata, editMode = false }) => {
  const sanitizedDisciplines = removeTypenameFromDisciplines(disciplines)
  const gradeStr = new Grade(
    gradeContext,
    grades,
    sanitizedDisciplines,
    areaMetadata.isBoulder
  ).toString()
  const url = `/climbs/${id}`
  return (
    <li className='py-2 break-inside-avoid-column break-inside-avoid'>
      <div className={clx('w-full', editMode ? 'card card-compact p-2 card-bordered bg-base-100 shadow' : '')}>
        <a href={url} className='flex gap-x-4 flex-nowrap w-full'>
          <ListBullet index={index} disciplines={disciplines} />
          <div className='w-full'>
            <div className='flex justify-between'>
              <div className='text-base font-semibold uppercase tracking-tight hover:underline'>{name}</div>
              <div>{gradeStr}</div>
            </div>
            <div><DisciplinesInfo disciplines={disciplines} /></div>
          </div>
        </a>
      </div>
      {editMode &&
        <ClimbListMiniToolbar climbId={id} parentAreaId={areaMetadata.areaId} climbName={name} />}
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
