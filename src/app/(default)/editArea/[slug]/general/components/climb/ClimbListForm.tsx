import clx from 'classnames'
import { AreaMetadataType, ClimbDisciplineRecord, ClimbType } from '@/js/types'
import { disciplineTypeToDisplay } from '@/js/grades/util'
import { removeTypenameFromDisciplines, climbLeftRightIndexComparator } from '@/js/utils'
import Grade, { GradeContexts } from '@/js/grades/Grade'
import { ClimbListMiniToolbar } from '../../../manageClimbs/components/ClimbListMiniToolbar'

export const ClimbList: React.FC<{ gradeContext: GradeContexts, climbs: ClimbType[], areaMetadata: AreaMetadataType, editMode: boolean, routePageId?: string }> = ({ gradeContext, climbs, areaMetadata, editMode, routePageId }) => {
  const sortedClimbs = [...climbs].sort(climbLeftRightIndexComparator)
  return (
    <div>
      {climbs.length === 0
        ? (
            editMode
              ? <NoClimbsEditModeCTA />
              : <NoClimbsCTA areaId={areaMetadata.areaId} />
          )
        : null}
      <ol className={routePageId === undefined ? clx(climbs.length < 5 ? 'block max-w-sm' : 'three-column-table', 'divide-y divide-base-200') : ''}>
        {sortedClimbs.map((climb, index) => {
          const isThisRoute = climb.id === routePageId
          return (
            <ClimbRow
              key={climb.id}
              gradeContext={gradeContext}
              areaMetadata={areaMetadata}
              {...climb}
              index={index + 1}
              editMode={editMode}
              isThisRoute={isThisRoute}
            />
          )
        })}
      </ol>
    </div>
  )
}

export const ClimbRow: React.FC<ClimbType & { index: number, gradeContext: GradeContexts, areaMetadata: AreaMetadataType, editMode?: boolean, isThisRoute: boolean }> = ({ id, name, type: disciplines, index, gradeContext, grades, areaMetadata, editMode = false, isThisRoute }) => {
  const sanitizedDisciplines = removeTypenameFromDisciplines(disciplines)
  const gradeStr = new Grade(
    gradeContext,
    grades,
    sanitizedDisciplines,
    areaMetadata.isBoulder
  ).toString()
  const url = `/climbs/${id}`
  return (
    <li className={clx('py-2 break-inside-avoid-column break-inside-avoid', isThisRoute ? 'opacity-50' : '')}>
      <div className={clx('w-full', editMode ? 'card card-compact p-2 card-bordered bg-base-100 shadow' : '')}>
        <LinkWrapper isThisRoute={isThisRoute} url={url}>
          <div className='flex gap-x-4 flex-nowrap w-full'>
            <ListBullet index={index} disciplines={disciplines} />
            <div className='w-full'>
              <div className='flex justify-between'>
                <div className={clx('text-base font-semibold uppercase tracking-tight', isThisRoute ? '' : 'hover:underline')}>{name}</div>
                <div>{gradeStr}</div>
              </div>
              <div><DisciplinesInfo disciplines={disciplines} /></div>
            </div>
          </div>
        </LinkWrapper>
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

const NoClimbsEditModeCTA: React.FC = () => (
  <div className='alert alert-info text-sm'>No climbs found.  Use the form below to add new climbs.</div>
)

const NoClimbsCTA: React.FC<{ areaId: string }> = ({ areaId }) => (
  <div className='alert alert-info text-sm'>
    No climbs found.&nbsp;
    <a href={`/editArea/${areaId}/manageClimbs`} className='btn btn-sm btn-solid btn-accent'>
      Add Climbs
    </a>
  </div>
)

const LinkWrapper: React.FC<{ isThisRoute: boolean, url: string, children: React.ReactNode }> = ({ isThisRoute, url, children }) => {
  return (
    <>
      {isThisRoute ? <>{children} </> : <a href={url}>{children}</a>}
    </>
  )
}
