import { Button, ButtonVariant } from '../ui/BaseButton'

import withAuthComponent from '../../js/auth/withAuthComponent'

function EditProfileButton (): JSX.Element {
  return (
    <Button href='/account/edit' label='Edit' variant={ButtonVariant.OUTLINED_DEFAULT} size='sm' />
  )
}

export default withAuthComponent(EditProfileButton)
