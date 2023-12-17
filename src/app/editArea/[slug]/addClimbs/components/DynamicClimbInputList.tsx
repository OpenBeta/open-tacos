import { useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { ListPlus, Minus } from '@phosphor-icons/react/dist/ssr'

import { BaseInput } from '@/components/ui/form/Input'

export const DynamicClimbInputList: React.FC<{ parentAreaUuid: string, name: string }> = ({ parentAreaUuid, name = 'climbList' }) => {
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    name
  })

  const addMoreFields = useCallback(() => {
    for (let i = 0; i < 5; i++) {
      append({ climbName: '' })
    }
  }, [append])

  return (
    <div>
      <ul>
        {fields.map((item, index) => {
          return (
            <li key={item.id}>

              <NewClimbInput
                parentAreaUuid={parentAreaUuid} index={index} count={fields.length}
                onRemove={(removeIndex) => remove(removeIndex)}
              />

            </li>
          )
        })}
      </ul>

      <button
        type='button'
        className='mt-6 btn btn-sm btn-primary btn-outline'
        onClick={addMoreFields}
        disabled={fields.length >= 30}
      >
        <ListPlus size={18} /> Bulk entry
      </button>
    </div>
  )
}

const NewClimbInput: React.FC<{ parentAreaUuid: string, index: number, count: number, onRemove: (index: number) => void }> = ({ parentAreaUuid, index, count, onRemove }) => {
  const formContext = useFormContext()
  const inputName = `climbList[${index}].climbName`
  return (
    <div>
      <div className='form-control'>
        <label className='label' htmlFor={inputName}><span className='label-text text-secondary'>Climb name {count > 1 ? index + 1 : ''}</span></label>
        <div className='flex items-center gap-4'>
          <BaseInput
            formContext={formContext}
            name={inputName}
            label={`Climb #${index + 1}`}
            className='w-full'
          />
          {count > 1 &&
            <button
              type='button'
              className='btn btn-sm btn-outline btn-circle'
              onClick={() => onRemove(index)}
            ><Minus size={18} />
            </button>}
        </div>
      </div>
    </div>
  )
}
