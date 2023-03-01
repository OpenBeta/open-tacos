import { useState, useEffect } from 'react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { useFormContext, useWatch } from 'react-hook-form'
import Grade from '../../../js/grades/Grade'
import { disciplineTypeToDisplay } from '../../../js/grades/util'

import { Input } from '../../ui/form'
import Tooltip from '../../ui/Tooltip'
import { RulesType } from '../../../js/types'

export const TradSportGradeInput: React.FC<BaseGradeInput> = ({ gradeObj }) => {
  const [validationRules, setValidationRules] = useState<RulesType>(gradeObj.getSportTradValidationRules())
  const { register, setError, clearErrors, formState: { errors } } = useFormContext()
  const currentDisciplines = useWatch({ name: 'disciplines' })

  useEffect(() => {
    const tokens = disciplineTypeToDisplay(currentDisciplines)
    if (tokens.length === 0) {
      setError('disciplines', { type: 'custom', message: 'Please set at least 1 discipline' })
    } else {
      clearErrors('disciplines')
    }
    const { trad, sport, tr } = currentDisciplines
    if (trad === true) {
      setValidationRules(gradeObj.getSportTradValidationRules('trad'))
      return
    }
    if (sport === true || tr === true) {
      setValidationRules(gradeObj.getSportTradValidationRules('sport'))
    }
  }, [currentDisciplines])

  // @eslint-expect-error
  const disciplinesError = (errors?.disciplines?.message) as string
  return (
    <div className='w-full mb-6 fadeinEffect'>
      <div className='w-52'>
        <Input label={`${gradeObj.routeScaleName} Grade`} name='gradeStr' placeholder={gradeObj.routeScaleName} registerOptions={validationRules} />
      </div>
      <div className='form-control mt-6'>
        <label className='label gap-x-2'>
          <span className='label-text font-semibold'>Disciplines</span>
          <Tooltip content='A crag can only have rope climbs. Please create a separate boulder to add problems.'>
            <div className='flex items-center gap-2 text-xs'>
              <span className='link-dotted hidden sm:inline-block text-info'>How to add boulder problems?</span
              ><QuestionMarkCircleIcon className='text-info w-5 h-5' />
            </div>
          </Tooltip>
        </label>
        <div className='columns-2 mt-4'>
          <label className='input-group mb-6'>
            <span className='bg-default uppercase text-sm w-20 '>Sport</span>
            <input type='checkbox' className='checkbox' {...register('disciplines.sport')} />
          </label>
          <label className='input-group mb-6'>
            <span className='bg-default uppercase text-sm w-20'>Trad</span>
            <input type='checkbox' className='checkbox' {...register('disciplines.trad')} />
          </label>
          <label className='input-group mb-6'>
            <span className='bg-default uppercase text-sm w-20'>Aid</span>
            <input type='checkbox' className='checkbox' {...register('disciplines.aid')} />
          </label>
          <label className='input-group'>
            <span className='bg-default uppercase text-sm w-20'>TR</span>
            <input type='checkbox' className='checkbox' {...register('disciplines.tr')} />
          </label>
        </div>
        <label className='label'>
          {disciplinesError != null
            ? (
              <div className='label-text-alt text-error'>
                {disciplinesError}
              </div>)
            : null}
        </label>
      </div>
    </div>
  )
}

interface BaseGradeInput {
  gradeObj: Grade
}

export const BoulderingGradeInput: React.FC<BaseGradeInput> = ({ gradeObj }) => {
  return (
    <div className='w-full mb-6 fadeinEffect'>
      <div className='w-48'>
        <Input label='Bouldering Grade' name='gradeStr' placeholder={gradeObj.boulderingScaleName} registerOptions={gradeObj.boulderingValidationRules} />
      </div>
      <div className='form-control mt-6'>
        <label className='label gap-x-2'>
          <span className='label-text font-semibold'>Disciplines</span>
          <Tooltip content='A boulder may contain only boulder problems. Please create a separate crag to add sport or trad climbs.'>
            <div className='flex items-center gap-2 text-xs'><span className='link-dotted hidden sm:inline-block text-info'>Want to add sport/trad?</span><QuestionMarkCircleIcon className='text-info w-5 h-5' /></div>
          </Tooltip>
        </label>
        <label className='input-group mt-4'>
          <span className='bg-default uppercase text-sm'>Bouldering</span>
          <input type='checkbox' checked className='checkbox' disabled />
        </label>
      </div>
    </div>
  )
}
