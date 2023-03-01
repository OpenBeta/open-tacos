import Link from 'next/link'
import { useController, useWatch } from 'react-hook-form'
import { indexBy, Dictionary } from 'underscore'
import clx from 'classnames'

import { EditableClimbType } from './cragSummary'
import { ClimbDisciplineRecord } from '../../js/types'
import { disciplineTypeToDisplay } from '../../js/grades/util'

type EditableClimbTypeWithFieldId = EditableClimbType & { id: string }
interface Props {
  editable: boolean
}

/**
 * Rendering the climb table.  The list is coming from react-hook-form context.
 */
export const ClimbListPreview = ({ editable }: Props): JSX.Element => {
  const { formState: { defaultValues } } = useController({ name: 'climbList' })

  const watchList: EditableClimbType[] = useWatch({ name: 'climbList' })
  const toBeDeleted = findDeletedCandidates(defaultValues?.climbList, watchList)
  const defaultDict = indexBy(defaultValues?.climbList, 'climbId')

  const lastItemOfFirstColumn = Math.ceil(watchList.length / 2) - 1
  return (
    <div className='mt-16 min-h-[8rem]'>
      <h3>Climbs&nbsp;<span className='text-base-300'>({watchList.length})</span></h3>
      <hr className='mt-1 mb-8 border-1 border-base-content' />

      <section className='two-column-table'>
        {watchList.map((entry, index: number) => {
          const { climbId, name } = entry
          const dirty = climbId != null && defaultDict?.[climbId]?.name !== name

          return (
            <Row
              key={entry.id} {...entry}
              index={index}
              showBorderBottom={index === lastItemOfFirstColumn || index === watchList.length - 1}
              dirty={dirty}
              editMode={editable}
            />
          )
        })}
        {watchList.length === 0 && <div className='text-base-300 italic'>None</div>}
      </section>

      {editable && toBeDeleted?.length > 0 && (
        <>
          <h3 className='mt-32 text-base-300 fadeinEffect'>To Be Deleted <span className=''>({toBeDeleted.length})</span></h3>
          <section className='two-column-table'>
            {toBeDeleted.map((entry, index) => (
              <Row
                key={entry.id} {...entry} index={index} toBeDeleted editMode={editable} dirty={false}
                showBorderBottom={index === Math.ceil(toBeDeleted.length / 2) - 1 || index === toBeDeleted.length - 1}
              />
            ))}
            {toBeDeleted?.length === 0 && <div className='text-base-300 italic'>None</div>}
          </section>
        </>)}
    </div>
  )
}

type ClimbEntryProps = EditableClimbTypeWithFieldId & {
  index: number
  defaultDict?: Dictionary<EditableClimbType>
  toBeDeleted?: boolean
  showBorderBottom?: boolean
  dirty: boolean
  editMode: boolean
}

/**
 * Encapsulate a table row
 */
const Row: React.FC<ClimbEntryProps> = (props) => {
  const { climbId, isNew = false, editMode, showBorderBottom = false } = props
  return (
    <WrapLink climbId={climbId} noLink={isNew} newWindow={!editMode} className={clx('area-row w-full', showBorderBottom ? 'border-b' : '')}>
      <RowIndex {...props} /><RowContent {...props} />
    </WrapLink>
  )
}

/**
 * Row bullet with visual cue to indicate modified, new, to be deleted
 */
const RowIndex: React.FC<ClimbEntryProps> = ({ index, dirty, isNew = false, toBeDeleted = false, disciplines }) => {
  const strictlySport = (disciplines?.sport ?? false) && !((disciplines?.trad ?? false) || (disciplines?.aid ?? false))
  return (
    <div className={
      clx('rounded-full h-8 w-8 grid place-content-center text-sm text-base-100 indicator',
        dirty && !isNew && !toBeDeleted ? 'outline-2 outline-secondary outline-offset-4 outline-dashed' : '',
        strictlySport ? 'bg-sport-climb-cue' : 'bg-primary/90',
        toBeDeleted ? 'bg-opacity-60' : ''
      )
      }
    >
      {isNew && !toBeDeleted &&
        <span className='indicator-item indicator-item-mod badge badge-xs badge-accent' />}
      {index + 1}
    </div>
  )
}

/**
 * Table row main content
 */
const RowContent: React.FC<ClimbEntryProps> = ({ name, disciplines, gradeStr }) => {
  return (
    <>
      <div className='flex flex-col items-start items-stretch grow gap-y-1'>
        <div className='font-semibold uppercase'>
          {name}
        </div>
        <div className='flex gap-2 items-center'>
          <DisciplinesInfo disciplines={disciplines} />
        </div>
      </div>
      <div className='uppercase font-semibold'>{gradeStr}</div>
    </>
  )
}

interface DisciplineInfoProps {
  disciplines: ClimbDisciplineRecord
}

const DisciplinesInfo: React.FC<DisciplineInfoProps> = ({ disciplines }) => {
  const tokens = disciplineTypeToDisplay(disciplines)
  return (
    <div className='text-base-300 text-xs h-2'>
      {tokens.length === 0 ? '' : tokens.join(' · ')}
    </div>
  )
}

interface WrapLinkProps {
  climbId: string | null
  /** `true`: Don't wrap children in 'a' tag */
  noLink: boolean
  /** `true`: open link in a new window */
  newWindow: boolean
  /** CSS class names */
  className: string
  /** Components to be wrapped */
  children: any
}

/**
 * Conditionally wrap child component in an 'a' tag.
 */
const WrapLink: React.FC<WrapLinkProps> = ({ climbId, className, noLink, newWindow, children }) => {
  if (climbId == null || noLink) {
    return <div className={className}>{children}</div>
  } else {
    return (
      <Link href={`/climbs/${climbId}`} {...newWindow ? { target: '_blank', rel: 'noreferrer' } : undefined}>
        <a className={className}>
          {children}
        </a>
      </Link>
    )
  }
}

export const findDeletedCandidates = (defaultList: EditableClimbType[], activeList: EditableClimbTypeWithFieldId[]): EditableClimbTypeWithFieldId[] => {
  const activeDict = indexBy(activeList, 'climbId')
  return defaultList.reduce<EditableClimbTypeWithFieldId[]>((accumulator, current): EditableClimbTypeWithFieldId[] => {
    if (activeDict?.[current.climbId] == null) {
      accumulator.push({ ...current, id: current.climbId })
    }
    return accumulator
  }, [])
}
