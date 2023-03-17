import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { RulesType } from '../../../js/types'
import Input from '../../ui/form/Input'
import Tooltip from '../../ui/Tooltip'

export const LEGACY_FA_FORM_VALIDATION_RULES: RulesType = {
  maxLength: {
    value: 100,
    message: '100 characters max'
  }

}

/**
 * A reusable react-hook-form input for updating FA field.
 *
 * Why naming this 'legacy'?   We'll introduce a more robust UI to add new and tag existing
 *  first ascenionists to better catalog climbs.
 */
export const LegacyFAInput: React.FC = () => {
  return (
    <Input
      label='First Ascent'
      labelAlt={
        <Tooltip
          content={<div>Examples:  <strong>Jane Doe 08/1993</strong> or <br /><strong>Yamada Hanako, Jean Dupont, 02/2023</strong><br />Leave blank if unknown.</div>}
        >
          <QuestionMarkCircleIcon className='text-info w-5 h-5' />
        </Tooltip>
        }
      name='legacyFA'
      placeholder='Yamada Hanako, Jean Dupont, 02/2023'
      registerOptions={LEGACY_FA_FORM_VALIDATION_RULES}
    />
  )
}
