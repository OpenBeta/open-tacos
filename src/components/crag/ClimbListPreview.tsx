import Link from 'next/link'
import { useController, useWatch } from 'react-hook-form'
import { indexBy, Dictionary } from 'underscore'
import clx from 'classnames'

import { EditableClimbType } from './cragSummary'

type EditableClimbTypeWithFieldId = EditableClimbType & { id: string }
interface Props {
  editable: boolean
}

/**
 * Rendering the climb table.  The list is coming from react-hook-form context.
 */
export const ClimbListPreview = ({ editable }: Props): JSX.Element => {
  const { formState: { defaultValues } } = useController({ name: 'climbList' })

  const watchList = useWatch({ name: 'climbList' })

  const toBeDeleted = findDeletedCandidates(defaultValues?.climbList, watchList)
  const defaultDict = indexBy(defaultValues?.climbList, 'climbId')

  const lastItemOfFirstColumn = Math.ceil(watchList.length / 2) - 1
  return (
    <div className='mt-16 min-h-[8rem]'>
      <h3>Climbs&nbsp;<span className='text-base-300'>({watchList.length})</span></h3>
      <hr className='mt-1 mb-8 border-1 border-base-content' />

      <section className='two-column-table'>
        {watchList.map((entry, index: number) =>
          <ClimbEntry
            key={entry.id} {...entry}
            index={index}
            showBorderBottom={index === lastItemOfFirstColumn || index === watchList.length - 1}
            defaultDict={defaultDict}
            editMode={editable}
          />)}
        {watchList.length === 0 && <div className='text-base-300 italic'>None</div>}
      </section>

      {editable && toBeDeleted?.length > 0 && (
        <>
          <h3 className='mt-6 text-base-300 fadeinEffect'>To Be Deleted <span className=''>({toBeDeleted.length})</span></h3>
          <section className='lg:columns-2 lg:gap-16'>
            {toBeDeleted.map((entry, index) => <ClimbEntry key={entry.id} {...entry} index={index} toBeDeleted editMode={editable} />)}
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
  editMode: boolean
}

const ClimbEntry = ({ id, isNew = false, climbId, name, gradeStr, index, defaultDict, toBeDeleted = false, showBorderBottom = false, editMode }: ClimbEntryProps): JSX.Element => {
  const isDirty = climbId != null && defaultDict?.[climbId]?.name !== name
  return (
    <div className='flex items-center gap-4 fadeinEffect break-inside-avoid-column break-inside-avoid'>
      <div className={
        clx('rounded-full h-8 w-8 grid place-content-center text-sm bg-primary/90 text-base-100 indicator',
          isDirty && !isNew && !toBeDeleted ? 'outline-2 outline-secondary outline-offset-4 outline-dashed' : '',
          toBeDeleted ? 'bg-opacity-60' : ''
        )
        }
      >
        {isNew && !toBeDeleted &&
          <span className='indicator-item indicator-item-mod badge badge-xs badge-success' />}
        {index + 1}
      </div>
      <div className={
        clx('border-t grow py-4 uppercase font-semibold flex items-center justify-between',
          (isDirty && !toBeDeleted) || isNew ? 'italic text-secondary' : '',
          toBeDeleted ? 'italic text-base-300' : '',
          showBorderBottom ? 'border-b' : '')
        }
      >
        <WrapLink climbId={climbId} text={name} noLink={isNew} newWindow={!editMode} />
        <div className={clx(gradeStr == null || gradeStr.trim() === '' ? 'text-base-200' : 'text-inherit')}>{gradeStr ?? 'UNKNOWN'}</div>
      </div>
    </div>
  )
}

interface WrapLinkProps {
  /** Climb name */
  text: string
  climbId: string | null
  /** `true`: Don't wrap text in 'a' tag */
  noLink: boolean
  /** `true`: open link in a new window */
  newWindow: boolean
}

/**
 * Conditionally wrap climb name in an 'a' tag.
 */
const WrapLink = ({ climbId, text, noLink, newWindow }: WrapLinkProps): JSX.Element => {
  if (climbId == null || noLink) {
    return <span>{text}</span>
  } else {
    return (
      <Link href={`/climbs/${climbId}`} {...newWindow ? { target: '_blank', rel: 'noreferrer' } : undefined}>
        <a className='thick-link'>
          {text}
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
