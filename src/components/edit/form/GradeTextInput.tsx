import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import clx from 'classnames'
import Grade from '../../../js/grades/Grade'

import { RulesType } from '../../../js/types'
import { InplaceTextInput } from '../../editor'
import { Input } from '../../ui/form'
import Tooltip from '../../ui/Tooltip'

interface GradeTextInputProps {
  initialValue: string
  resetSignal: number
  editable: boolean
}

export const GradeTextInput: React.FC<GradeTextInputProps> = ({ initialValue, resetSignal, editable }) => {
  return (
    <div className='form-control'>
      <label className='label'>
        <span className='cursor-pointer label-text font-semibold uppercase'>Grade</span>
        <span className='cursor-pointer label-text-alt'>&nbsp;</span>
      </label>
      <InplaceTextInput
        initialValue={initialValue}
        name='gradeTextInput'
        reset={resetSignal}
        editable={editable}
        placeholder='Grade'
        className={clx('rounded border border-base-content overflow-hidden text-md', editable ? 'w-24' : 'px-6')}
        rules={BASE_GRADE_FORM_VALIDATION_RULES}
      />
    </div>
  )
}

const BASE_GRADE_FORM_VALIDATION_RULES: RulesType = {
  maxLength: {
    value: 8,
    message: 'Maxium 8 letters'
  }
}

interface BaseGradeInput {
  gradeObj: Grade
}

export const BoulderingGradeInput: React.FC<BaseGradeInput> = ({ gradeObj }) => {
  return (
    <div className='w-full mb-6'>
      <div className='w-48'>
        <Input label='Bouldering Grade' name='gradeStr' placeholder={gradeObj.boulderingScaleName} registerOptions={gradeObj.boulderingValidationRules()} />
      </div>
      <div className='form-control'>
        <label className='label gap-x-2'>
          <span className='label-text font-semibold'>Disciplines</span>
          <Tooltip content='A boulder may contain only boulder problems. Please create a separate crag to add sport or trad climbs.'>
            <div className='flex items-center gap-2 text-xs'><span className='link-dotted hidden sm:inline-block'>Want to add sport/trad?</span><QuestionMarkCircleIcon className='text-info w-5 h-5' /></div>
          </Tooltip>
        </label>
        <label className='input-group'>
          <span className='bg-default uppercase text-sm'>Bouldering</span>
          <input type='checkbox' checked className='checkbox' disabled />
        </label>
      </div>
    </div>
  )
}
