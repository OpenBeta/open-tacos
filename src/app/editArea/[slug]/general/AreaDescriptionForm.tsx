'use client'
import { useSession } from 'next-auth/react'

import { SingleEntryForm } from 'app/area/[...slug]/SingleEntryForm'
import { AREA_DESCRIPTION_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'
import useUpdateAreasCmd from '@/js/hooks/useUpdateAreasCmd'
import { MDTextArea } from '@/components/ui/form/MDTextArea'

export const AreaDescriptionForm: React.FC<{ initialValue: string, uuid: string }> = ({ initialValue, uuid }) => {
  const session = useSession({ required: true })
  const { updateOneAreaCmd } = useUpdateAreasCmd(
    {
      areaId: uuid,
      accessToken: session?.data?.accessToken as string
    }
  )

  return (
    <SingleEntryForm<{ description: string }>
      initialValues={{ description: initialValue }}
      submitHandler={({ description }) => {
        void updateOneAreaCmd({ description })
      }}
    >
      <MDTextArea
        initialValue={initialValue}
        name='description'
        label='Description'
        description='Describe this area to the best of your knowledge.'
        helper='Do not copy description from guidebooks.'
        rules={AREA_DESCRIPTION_FORM_VALIDATION_RULES}
      />
    </SingleEntryForm>
  )
}
