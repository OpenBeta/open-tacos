import { RulesType } from '../../../js/types'
import Input from '../../ui/form/Input'

const errorMsg = 'Enter a value between 1 and 9999.  Leave blank if unknown.'

export const CLIMB_LENGTH_FORM_VALIDATION_RULES: RulesType = {
  min: {
    value: 1,
    message: errorMsg
  },
  max: {
    value: 9999,
    message: errorMsg
  },

  valueAsNumber: true
}

/**
 * Reusable react-hook-form input for setting climb length
 */
export const TotalLengthInput: React.FC = () => {
  return (
    <Input
      label='Length'
      unitLabel='METERS'
      name='length'
      placeholder='Example: 42'
      registerOptions={CLIMB_LENGTH_FORM_VALIDATION_RULES}
      type='number'
    />
  )
}
