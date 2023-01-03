import { useController } from 'react-hook-form'
import Link from 'next/link'
import { indexBy } from 'underscore'

import { EditableClimbType } from './cragSummary'

export const ClimbListPreview = (): JSX.Element => {
  const { field, formState } = useController({ name: 'climbList' })
  console.log('#State', formState.defaultValues?.climbList)
  const toBeDeleted = findDeletedClimbs(formState.defaultValues?.climbList, field.value)
  return (
    <>
      <h3 className='mt-16'>Climbs&nbsp;<span className='text-base-300'>({field.value.length})</span></h3>
      <div className='lg:columns-2 lg:gap-16'>
        {field.value?.map(ClimbEntry)}
        {field.value.length === 0 && <div className='text-base-300 italic'>None</div>}
      </div>
      <h3 className='mt-6'>To be deleted <span className='text-base-300'>({toBeDeleted.length})</span></h3>
      <div className='lg:columns-2 lg:gap-16'>
        {toBeDeleted.map(ClimbEntry)}
        {toBeDeleted.length === 0 && <div className='text-base-300 italic'>None</div>}
      </div>
    </>
  )
}

const ClimbEntry = ({ id, name, yds }: EditableClimbType, index: number): JSX.Element => {
  const key = `${id == null ? `name_${index}` : id}`
  return (
    <div key={key} className='my-2 flex items-center gap-4 fadeinEffect'>
      <div className='rounded-full h-8 w-8 grid place-content-center text-sm bg-primary text-base-100 indicator'>
        {id == null && <span className='indicator-item badge badge-secondary text-xxs'>new</span>}
        {index + 1}
      </div>
      <div className='grow border-t-2 py-2 uppercase font-semibold text-base-content flex items-center justify-between'>
        <div><WrapLink id={id} text={name} /></div>
        <div>{yds}</div>
      </div>
    </div>
  )
}

const WrapLink = ({ id, text }: { id: string | null, text: string }): JSX.Element => {
  if (id != null) {
    return (
      <Link href={`/climbs/${id}`}>
        <a className='hover:underline underline-offset-4 decoration-4' target='_blank' rel='noreferrer'>
          {text}
        </a>
      </Link>
    )
  }
  return <span>{text}</span>
}

const findDeletedClimbs = (defaultList: EditableClimbType[], activeList: EditableClimbType[]): EditableClimbType[] => {
  const activeDict = indexBy(activeList, 'id')
  const f = defaultList.reduce<EditableClimbType[]>((accumulator, current): EditableClimbType[] => {
    if (current.id != null && activeDict?.[current.id] == null) {
      accumulator.push(current)
    }
    return accumulator
  }, [])
  return f
}
