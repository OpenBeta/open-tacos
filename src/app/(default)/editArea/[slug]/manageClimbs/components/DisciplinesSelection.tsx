'use client'
import { useState, useEffect } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
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
  const { setValue, setError, clearErrors, formState: { errors } } = formContext
  const fieldName = `${CLIMB_ARRAY_FIELD_NAME}[${index}].disciplines`

  const disciplines: Partial<ClimbDisciplineRecord> = useWatch({ name: fieldName })
  const climbName: string = useWatch({ name: `${CLIMB_ARRAY_FIELD_NAME}[${index}].name` })

  const numberOfCheckedDisciplines = Object.values(disciplines).filter(el => el).length

  useEffect(() => {
    if (disciplines != null) {
      const hasDiscipline = Object.values(disciplines).some(el => el)
      if (hasDiscipline) {
        // @ts-expect-error
        clearErrors(fieldName)
      } else if (climbName != null && climbName.trim() !== '') {
        // @ts-expect-error
        setError(fieldName, { type: 'custom', message: 'Please select at least one discipline.' })
      }
    }
  }, [disciplines, climbName])

  const clearAll = (): void => {
    // @ts-expect-error
    setValue(fieldName, defaultDisciplines())
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
  const { register, watch } = formContext
  const fieldName = `${CLIMB_ARRAY_FIELD_NAME}[${index}].disciplines.${discipline}` as keyof ClimbDisciplineRecord

  // @ts-expect-error
  const checked = watch(fieldName) as boolean

  return (
    <label className={clx('cursor-pointer rounded-btn border px-2.5 py-1.5 flex items-center gap-2', checked ? 'border-base-content/80' : '')}>
      <input
        type='checkbox' className='checkbox'
        // @ts-expect-error
        {...register(fieldName)}
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

  const { watch, formState: { errors } } = formContext

  const fieldName = `${CLIMB_ARRAY_FIELD_NAME}[${index}].grade`
  // @ts-expect-error
  const disciplines = watch(`${CLIMB_ARRAY_FIELD_NAME}[${index}].disciplines`) as ClimbDisciplineRecord

  useEffect(() => {
    const rules = getGradeValationRules(gradeContext, disciplines)
    setValidationRules(rules?.rules)
    setGradeScale(rules?.scale)
  }, [JSON.stringify(disciplines)])

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
        // @ts-expect-error
        formContext={formContext}
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
