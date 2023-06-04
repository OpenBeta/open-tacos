import { Button, ButtonVariant } from '../ui/BaseButton'

import forOwnerOnly from '../../js/auth/forOwnerOnly'

function EditProfileButton (): JSX.Element {
  return (
    <Button href='/account/edit' label='Edit' variant={ButtonVariant.OUTLINED_DEFAULT} size='sm' />
  )
}

export default forOwnerOnly(EditProfileButton)
