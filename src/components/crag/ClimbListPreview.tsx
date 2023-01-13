import { useController, useWatch } from 'react-hook-form'
import Link from 'next/link'
import { indexBy, Dictionary } from 'underscore'
import clx from 'classnames'

import { EditableClimbType } from './cragSummary'

type EditableClimbTypeWithFieldId = EditableClimbType & { id: string }
interface Props {
  editable: boolean
}

export const ClimbListPreview = ({ editable }: Props): JSX.Element => {
  const { formState: { defaultValues } } = useController({ name: 'climbList' })

  const watchList = useWatch({ name: 'climbList' })

  const toBeDeleted = findDeletedCandidates(defaultValues?.climbList, watchList)
  const defaultDict = indexBy(defaultValues?.climbList, 'climbId')

  return (
    <div className='mt-16 min-h-[8rem]'>
      <h3>Climbs&nbsp;<span className='text-base-300'>({watchList.length})</span></h3>
      <section className='lg:columns-2 lg:gap-16'>
        {watchList.map((entry, index) =>
          <ClimbEntry
            key={entry.id} {...entry} index={index}
            defaultDict={defaultDict}
          />)}
        {watchList.length === 0 && <div className='text-base-300 italic'>None</div>}
      </section>
      {editable && toBeDeleted?.length > 0 && (
        <>
          <h3 className='mt-6 text-base-300 fadeinEffect'>To Be Deleted <span className=''>({toBeDeleted.length})</span></h3>
          <section className='lg:columns-2 lg:gap-16'>
            {toBeDeleted.map((entry, index) => <ClimbEntry key={entry.id} {...entry} index={index} toBeDeleted />)}
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
}

const ClimbEntry = ({ id, isNew = false, climbId, name, yds, index, defaultDict, toBeDeleted = false }: ClimbEntryProps): JSX.Element => {
  const isDirty = climbId != null && defaultDict?.[climbId]?.name !== name
  return (
    <div className='my-2 flex items-center gap-4 fadeinEffect'>
      <div className={
        clx('rounded-full h-8 w-8 grid place-content-center text-sm bg-primary text-base-100 indicator',
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
  clx('grow border-t-2 py-2 uppercase font-semibold flex items-center justify-between', (isDirty && !toBeDeleted) || isNew ? 'italic text-secondary' : '',
    toBeDeleted ? 'italic text-base-300' : '')
  }
      >
        <WrapLink climbId={climbId} text={name} />
        <div className='text-inherit'>{yds}</div>
      </div>
    </div>
  )
}

const WrapLink = ({ climbId, text }: { climbId: string | null, text: string }): JSX.Element => {
  if (climbId != null) {
    return (
      <Link href={`/climbs/${climbId}`}>
        <a className='hover:underline underline-offset-4 decoration-4' target='_blank' rel='noreferrer'>
          {text}
        </a>
      </Link>
    )
  }
  return <span>{text}</span>
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
