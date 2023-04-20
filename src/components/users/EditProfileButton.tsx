import React from 'react'
import { Button, ButtonVariant } from '../ui/BaseButton'
import forOwnerOnly from '../../js/auth/forOwnerOnly'
import { WithOwnerProfile } from '../../js/types/User'
import Tooltip from '../ui/Tooltip'

interface EditProfileButtonProps extends WithOwnerProfile {
  loginsCount?: number // Add loginsCount prop
}

/**
 * EditProfileButton component displays a "Edit" button with optional tooltip based on loginsCount prop.
 * @param {EditProfileButtonProps} loginsCount - The number of times a user has logged in since account creation.
 * @returns {JSX.Element} - JSX element representing the EditProfileButton component.
 */
function EditProfileButton ({ loginsCount }: EditProfileButtonProps): JSX.Element {
  return (
    <>
      {loginsCount === 1
        ? (
          <Tooltip
            side='bottom'
            defaultOpen
            enabled
            content='It looks like this is your first time logging in, click here to change your username!'
          >
            <Button
              href='/account/edit'
              label='Edit'
              variant={ButtonVariant.OUTLINED_DEFAULT}
              size='sm'
            />
          </Tooltip>
          )
        : loginsCount !== undefined && loginsCount > 0
          ? (
            <Button
              href='/account/edit'
              label='Edit'
              variant={ButtonVariant.OUTLINED_DEFAULT}
              size='sm'
            />
            )
          : null}
    </>
  )
}

export default forOwnerOnly<EditProfileButtonProps>(EditProfileButton)
