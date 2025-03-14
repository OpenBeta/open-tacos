'use client'
import { useSession } from 'next-auth/react'
import { ValidationValueMessage } from 'react-hook-form'

import { SingleEntryForm } from '@/app/(default)/components/AreaAndClimb/SingleEntryForm'
import { DashboardInput } from '@/components/ui/form/Input'
import useUpdateClimbsCmd from '@/js/hooks/useUpdateClimbsCmd'
import { CLIMB_NAME_FORM_VALIDATION_RULES } from '../validation'

export const ClimbNameForm: React.FC<{ initialValue: string, uuid: string, parentId: string }> = ({ uuid, initialValue, parentId }) => {
  const session = useSession({ required: true })

  const { updateClimbCmd } = useUpdateClimbsCmd({
    parentId,
    accessToken: session?.data?.accessToken as string
  }
  )

  const maxLengthValidation = CLIMB_NAME_FORM_VALIDATION_RULES.maxLength as ValidationValueMessage

  return (
    <SingleEntryForm<{ climbName: string }>
      title='Climb name'
      initialValues={{ climbName: initialValue }}
      submitHandler={async ({ climbName }) => {
        const input = {
          parentId,
          changes: [{ id: uuid, name: climbName }]
        }
        await updateClimbCmd(input)
      }}
      helperText={`Please use ${maxLengthValidation.value.toString()} characters at maximum.`}
    >
      <DashboardInput
        name='climbName'
        label='This is the name of the climb.'
        registerOptions={CLIMB_NAME_FORM_VALIDATION_RULES}
        className='w-full'
      />
    </SingleEntryForm>
  )
}
