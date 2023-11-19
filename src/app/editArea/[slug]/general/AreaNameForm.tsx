'use client'
import { useSession } from 'next-auth/react'
import { ValidationValueMessage } from 'react-hook-form'

import { SingleEntryForm } from 'app/editArea/[slug]/components/SingleEntryForm'
import { DashboardInput } from '@/components/ui/form/Input'
import useUpdateAreasCmd from '@/js/hooks/useUpdateAreasCmd'
import { AREA_NAME_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'

export const AreaNameForm: React.FC<{ initialValue: string, uuid: string }> = ({ uuid, initialValue }) => {
  const session = useSession({ required: true })
  const { updateOneAreaCmd } = useUpdateAreasCmd({
    areaId: uuid,
    accessToken: session?.data?.accessToken as string
  }
  )

  const maxLengthValidation = AREA_NAME_FORM_VALIDATION_RULES.maxLength as ValidationValueMessage

  return (
    <SingleEntryForm<{ areaName: string }>
      title='Area name'
      initialValues={{ areaName: initialValue }}
      submitHandler={async ({ areaName }) => {
        await updateOneAreaCmd({ areaName })
      }}
      helperText={`Please use ${maxLengthValidation.value.toString()} characters at maximum.`}
    >
      <DashboardInput
        name='areaName'
        label='This is the name of the climbing area.'
        registerOptions={AREA_NAME_FORM_VALIDATION_RULES}
        className='w-full'
      />
    </SingleEntryForm>
  )
}
