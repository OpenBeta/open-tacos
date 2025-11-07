'use client'
import { useState, useEffect } from 'react'
import { UseFormReturn, useWatch, FieldPath } from 'react-hook-form'
import clx from 'classnames'
import { getScale } from '@openbeta/sandbag'

import { BaseInput } from '@/components/ui/form/Input'
import { ClimbDisciplineRecord, RulesType } from '@/js/types'
import { CLIMB_ARRAY_FIELD_NAME } from './DynamicClimbInputList'
import { defaultDisciplines } from '@/js/grades/util'
import { GradeContexts, gradeContextToGradeScales } from '@/js/grades/Grade'
import { AddClimbsFormData } from './AddClimbsForm'

interface FieldArrayInputProps {
  index: number
  formContext: UseFormReturn<AddClimbsFormData>
  gradeContext: GradeContexts
}

/**
 * Disciplines selection and grade input.
 * When the climb name is not empty, at least one discipline must be selected.
 */
export const DisciplinesSelection: React.FC<FieldArrayInputProps> = ({ formContext, index, gradeContext }) => {
  const { setValue, setError, clearErrors, formState: { errors }, control } = formContext

  const disciplines = useWatch({
    control,
    name: `${CLIMB_ARRAY_FIELD_NAME}.${index}.disciplines` as FieldPath<AddClimbsFormData>
  }) as Partial<ClimbDisciplineRecord>

  const climbName = useWatch({
    control,
    name: `${CLIMB_ARRAY_FIELD_NAME}.${index}.name` as FieldPath<AddClimbsFormData>
  }) as string

  const numberOfCheckedDisciplines = Object.values(disciplines ?? {}).filter(el => el).length

  useEffect(() => {
    if (disciplines != null) {
      const hasDiscipline = Object.values(disciplines).some(el => el)
      if (hasDiscipline) {
        clearErrors(`${CLIMB_ARRAY_FIELD_NAME}.${index}.disciplines` as FieldPath<AddClimbsFormData>)
      } else if (climbName != null && climbName.trim() !== '') {
        setError(`${CLIMB_ARRAY_FIELD_NAME}.${index}.disciplines` as FieldPath<AddClimbsFormData>, { type: 'custom', message: 'Please select at least one discipline.' })
      }
    }
  }, [disciplines, climbName, index, setError, clearErrors])

  const clearAll = (): void => {
    setValue(`${CLIMB_ARRAY_FIELD_NAME}.${index}.disciplines` as FieldPath<AddClimbsFormData>, defaultDisciplines())
  }

  const hasError = (errors?.climbList?.[index]?.disciplines ?? null) != null && (climbName?.trim() ?? '') !== ''

  return (
    <>
      <fieldset className='border rounded-box p-4 '>
        <legend className='text-sm py-2 px-1'>Disciplines:</legend>
        <div className='flex flex-col gap-5'>
          <div className='flex items-center gap-3 flex-wrap'>
            <Checkbox label='Sport' index={index} discipline='sport' formContext={formContext} />
            <Checkbox label='Trad' index={index} discipline='trad' formContext={formContext} />
            <Checkbox label='Bouldering' index={index} discipline='bouldering' formContext={formContext} />
          </div>

          <div className='flex items-center gap-3 flex-wrap'>
            <Checkbox label='Aid' index={index} discipline='aid' formContext={formContext} />
            <Checkbox label='Top Rope' index={index} discipline='tr' formContext={formContext} />
            <Checkbox label='Deep Water Soloing' index={index} discipline='deepwatersolo' formContext={formContext} />
          </div>

          <div className='flex items-center gap-3 flex-wrap'>
            <Checkbox label='Mixed' index={index} discipline='mixed' formContext={formContext} />
            <Checkbox label='Ice' index={index} discipline='ice' formContext={formContext} />
            <Checkbox label='Snow' index={index} discipline='snow' formContext={formContext} />
            <Checkbox label='Alpine' index={index} discipline='alpine' formContext={formContext} />
          </div>

          <div className='self-end'>
            <button className='btn btn-link btn-sm' disabled={numberOfCheckedDisciplines === 0} onClick={clearAll}>Clear all</button>
          </div>

          <div className='label-text-alt text-error'>
            {hasError && 'Please select at least one discipline'}
          </div>
        </div>

      </fieldset>

      <div className='mt-2'>
        <GradeInput formContext={formContext} index={index} gradeContext={gradeContext} />
      </div>
    </>
  )
}

/**
 * Checkbox for each discipline
 */
const Checkbox: React.FC<{ label: string, discipline: keyof ClimbDisciplineRecord } & Omit<FieldArrayInputProps, 'gradeContext'>> = ({ label, index, discipline, formContext }) => {
  const { register, control } = formContext

  const checked = useWatch({
    control,
    name: `${CLIMB_ARRAY_FIELD_NAME}.${index}.disciplines.${discipline}` as FieldPath<AddClimbsFormData>
  }) as boolean

  return (
    <label className={clx('cursor-pointer rounded-btn border px-2.5 py-1.5 flex items-center gap-2', checked ? 'border-base-content/80' : '')}>
      <input
        type='checkbox' className='checkbox'
        {...register(`${CLIMB_ARRAY_FIELD_NAME}.${index}.disciplines.${discipline}` as FieldPath<AddClimbsFormData>)}
      />
      <span className='uppercase text-sm select-none'>{label}</span>
    </label>
  )
}

/**
 * Grade textbox
 */
const GradeInput: React.FC<FieldArrayInputProps> = ({ formContext, index, gradeContext }) => {
  const [validationRules, setValidationRules] = useState<RulesType | undefined>()
  const [gradeScale, setGradeScale] = useState<ReturnType<typeof getScale>>()

  const { control, formState: { errors } } = formContext

  const fieldName = `${CLIMB_ARRAY_FIELD_NAME}.${index}.grade` as FieldPath<AddClimbsFormData>
  const disciplines = useWatch({
    control,
    name: `${CLIMB_ARRAY_FIELD_NAME}.${index}.disciplines` as FieldPath<AddClimbsFormData>
  }) as ClimbDisciplineRecord

  useEffect(() => {
    const rules = getGradeValationRules(gradeContext, disciplines)
    setValidationRules(rules?.rules)
    setGradeScale(rules?.scale)
  }, [gradeContext, disciplines])

  const disciplinesError = errors?.climbList?.[index]?.grade?.message as string

  const gradeScaleDisplay = gradeScale?.displayName?.toUpperCase() ?? 'Unknown'
  return (
    <div>
      <label className='label' htmlFor='grade'>
        <span className='label-text flex items-center gap-2'>
          Grade
          <span className='badge badge-sm bg-base-300/60'>Context={gradeContext.toUpperCase()}</span>
          <span className='badge badge-sm bg-blue-300'>Scale={gradeScaleDisplay}</span>
        </span>
      </label>
      <BaseInput
        name={fieldName}
        formContext={formContext as unknown as UseFormReturn}
        registerOptions={validationRules}
      />
      <label className='label'>
        {disciplinesError != null
          ? (
            <div className='label-text-alt text-error'>
              {disciplinesError != null && disciplinesError}
            </div>)
          : null}
      </label>
    </div>
  )
}

interface ValidationRules {
  rules: RulesType
  scale: ReturnType<typeof getScale>
}

const getGradeValationRules = (gradeContext: GradeContexts, disciplines: Partial<ClimbDisciplineRecord>): ValidationRules | undefined => {
  const gradescales = gradeContextToGradeScales?.[gradeContext]
  if (gradescales == null) {
    throw new Error('Unknown grade context')
  }

  const getValidationRules = (discipline: keyof ClimbDisciplineRecord): ValidationRules => {
    const gradeScale = getScale(gradescales[discipline])

    const isValidGrade = (userInput: string): string | undefined => {
      if (userInput == null || userInput === '') return undefined // possible to have unknown grade (Ex: route under development)
      const score = gradeScale?.getScore(userInput) ?? -1
      return Array.isArray(score) || score >= 0 ? undefined : 'Invalid grade'
    }
    return {
      scale: gradeScale,
      rules: {
        validate: {
          isValidGrade
        }
      }
    }
  }

  //  Processing priority
  if (disciplines?.tr ?? false) {
    return getValidationRules('tr')
  }

  if (disciplines?.sport ?? false) {
    return getValidationRules('sport')
  }

  if (disciplines?.trad ?? false) {
    return getValidationRules('trad')
  }

  if (disciplines?.bouldering ?? false) {
    return getValidationRules('bouldering')
  }

  if (disciplines?.deepwatersolo ?? false) {
    return getValidationRules('deepwatersolo')
  }

  if (disciplines?.aid ?? false) {
    return getValidationRules('aid')
  }

  if (disciplines?.ice ?? false) {
    return getValidationRules('ice')
  }

  if (disciplines?.mixed ?? false) {
    return getValidationRules('mixed')
  }

  if (disciplines?.alpine ?? false) {
    return getValidationRules('alpine')
  }

  if (disciplines?.snow ?? false) {
    return getValidationRules('snow')
  }

  return undefined
}
