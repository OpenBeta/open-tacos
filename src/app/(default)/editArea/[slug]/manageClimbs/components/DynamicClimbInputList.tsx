import { useCallback, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { ListPlus, LightbulbFilament } from '@phosphor-icons/react/dist/ssr'

import { BaseInput } from '@/components/ui/form/Input'
import { DisciplinesSelection } from './DisciplinesSelection'
import { GradeContexts } from '@/js/grades/Grade'
import { AREA_NAME_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'
import { AddClimbsFormData } from './AddClimbsForm'
import { defaultDisciplines } from '@/js/grades/util'
import { RulesType } from '@/js/types'

export const CLIMB_ARRAY_FIELD_NAME = 'climbList'
const EMPTY_ENTRY_PER_CLICK = 5
const MAX_EMPTY_ENTRIES = 30

/**
 * New climb entry form
 */
export const DynamicClimbInputList: React.FC<{ parentAreaUuid: string, gradeContext: GradeContexts }> = ({ parentAreaUuid, gradeContext }) => {
  const {
    fields,
    append,
    remove
  } = useFieldArray<AddClimbsFormData>({
    name: CLIMB_ARRAY_FIELD_NAME
  })

  const addMoreFields = useCallback(() => {
    for (let i = 0; i < EMPTY_ENTRY_PER_CLICK; i++) {
      append({ name: '', grade: '', disciplines: defaultDisciplines() })
    }
  }, [append])

  return (
    <div>
      <ul className='space-y-6'>
        {fields.map((item, index) => {
          return (
            <li key={item.id} className='block border-b border-b-2 border-base-300 pb-4'>
              <NewClimbInput
                gradeContext={gradeContext}
                index={index}
                count={fields.length}
                onRemove={(removeIndex) => remove(removeIndex)}
              />
            </li>
          )
        })}
      </ul>

      <div role='alert' className='mt-6 alert shadow'>
        <LightbulbFilament size={24} />
        <div>
          <div className='text-sm'>Entering more than one climb?</div>
          <div>
            <button
              type='button'
              className='mt-2 btn btn-sm btn-primary btn-outline'
              onClick={addMoreFields}
              disabled={fields.length >= MAX_EMPTY_ENTRIES}
            >
              <ListPlus size={18} /> Bulk entry
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const NewClimbInput: React.FC<{ gradeContext: GradeContexts, index: number, count: number, onRemove: (index: number) => void }> =
  ({ gradeContext, index, count, onRemove }) => {
    const formContext = useFormContext<AddClimbsFormData>()
    const { getValues } = formContext
    const inputName = `${CLIMB_ARRAY_FIELD_NAME}[${index}].name`

    const { formState: { errors } } = formContext
    const errorMsg = errors?.[CLIMB_ARRAY_FIELD_NAME]?.[index]?.name?.message as string ?? null

    const [validationRules, setValidationRules] = useState<RulesType | undefined>()
    useEffect(() => {
      const disciplines = getValues(`climbList.${index}.disciplines`)
      if (disciplines != null && Object.values(disciplines).some(el => el)) {
        setValidationRules(AREA_NAME_FORM_VALIDATION_RULES)
      } else {
        setValidationRules(undefined)
      }
    })
    return (
      <div className='form-control'>
        <label className='label' htmlFor={inputName}><span className='label-text font-semibold'>Climb name {count > 1 ? index + 1 : ''}</span></label>
        <div className='flex items-center gap-4'>
          <BaseInput
            // @ts-expect-error
            formContext={formContext}
            name={inputName}
            label={`Climb #${index + 1}`}
            className='w-full'
            registerOptions={validationRules}
          />
          {count > 1 &&
            <button
              type='button'
              className='btn btn-sm btn-outline btn-glass'
              onClick={() => onRemove(index)}
            >
              Remove
            </button>}
        </div>

        <div className='label'>
          {errorMsg != null && <span className='label-text-alt text-error'>{errorMsg}</span>}
        </div>

        <DisciplinesSelection formContext={formContext} index={index} gradeContext={gradeContext} />

      </div>
    )
  }
