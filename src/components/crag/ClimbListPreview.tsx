import { useController } from 'react-hook-form'
import Link from 'next/link'
import { indexBy, Dictionary } from 'underscore'
import clx from 'classnames'

import { EditableClimbType } from './cragSummary'

type EditableClimbTypeWithFieldId = EditableClimbType & { id: string }
interface Props {
  editable: boolean
}

export const ClimbListPreview = ({ editable }: Props): JSX.Element => {
  const { field, formState: { dirtyFields, defaultValues } } = useController({ name: 'climbList' })

  const toBeDeleted = findDeletedClimbs(defaultValues?.climbList, field.value)
  const defaultDict = indexBy(defaultValues?.climbList, 'climbId')
  return (
    <>
      <h3 className='mt-16'>Climbs&nbsp;<span className='text-base-300'>({field.value.length})</span></h3>
      <div className='lg:columns-2 lg:gap-16'>
        {field.value.map((entry, index) =>
          <ClimbEntry
            key={entry.id} {...entry} index={index}
            dirtyFields={dirtyFields.climbList}
            defaultDict={defaultDict}
          />)}
        {field.value.length === 0 && <div className='text-base-300 italic'>None</div>}
      </div>
      {editable && (
        <>
          <h3 className='mt-6'>To be deleted <span className='text-base-300'>({toBeDeleted.length})</span></h3>
          <div className='lg:columns-2 lg:gap-16'>
            {toBeDeleted.map(ClimbEntry)}
            {toBeDeleted?.length === 0 && <div className='text-base-300 italic'>None</div>}
          </div>
        </>)}
    </>
  )
}

type ClimbEntryProps = EditableClimbTypeWithFieldId & {
  dirtyFields: any
  index: number
  defaultDict: Dictionary<EditableClimbType>
}

const ClimbEntry = ({ id, climbId, name, yds, dirtyFields, index, defaultDict }: ClimbEntryProps): JSX.Element => {
  const isDirty = climbId != null && defaultDict?.[climbId]?.name !== name
  const isNew = climbId == null
  return (
    <div className='my-2 flex items-center gap-4 fadeinEffect'>
      <div className={clx('rounded-full h-8 w-8 grid place-content-center text-sm bg-primary text-base-100 indicator', isDirty && !isNew ? 'outline-2 outline-secondary outline-offset-4 outline-dashed' : '')}>
        {isNew && <span className='indicator-item'><span className='px-1 font-bold text-lg text-base-content bg-warning rounded-full'>+</span></span>}
        {index + 1}
      </div>
      <div className='grow border-t-2 py-2 uppercase font-semibold text-base-content flex items-center justify-between'>
        <div className={clx(isDirty ? 'italic text-secondary' : '')}>
          <WrapLink climbId={climbId} text={name} />
        </div>
        <div>{yds}</div>
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

const findDeletedClimbs = (defaultList: EditableClimbType[], activeList: EditableClimbTypeWithFieldId[]): EditableClimbTypeWithFieldId[] => {
  const activeDict = indexBy(activeList, 'climbId')
  const f = defaultList.reduce<EditableClimbTypeWithFieldId[]>((accumulator, current): EditableClimbTypeWithFieldId[] => {
    if (current.climbId != null && activeDict?.[current.climbId] == null) {
      accumulator.push({ ...current, id: current.climbId })
    }
    return accumulator
  }, [])
  return f
}
