'use client'
import { useSession } from 'next-auth/react'
import { ValidationValueMessage } from 'react-hook-form'

import { SingleEntryForm } from '@/app/(default)/editArea/[slug]/components/SingleEntryForm'
import { DashboardInput } from '@/components/ui/form/Input'
import useUpdateClimbsCmd from '@/js/hooks/useUpdateClimbsCmd'
import { AREA_NAME_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'

export const ClimbNameForm: React.FC<{ initialValue: string, uuid: string, parentId: string }> = ({ uuid, initialValue, parentId }) => {
  const session = useSession({ required: true })
  console.log('sesh', session)

  const { updateClimbCmd } = useUpdateClimbsCmd({
    parentId,
    accessToken: session?.data?.accessToken as string
  }
  )

  const maxLengthValidation = AREA_NAME_FORM_VALIDATION_RULES.maxLength as ValidationValueMessage

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
        registerOptions={AREA_NAME_FORM_VALIDATION_RULES}
        className='w-full'
      />
    </SingleEntryForm>
  )
}
