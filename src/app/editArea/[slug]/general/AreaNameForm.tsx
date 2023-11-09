'use client'
import { useSession } from 'next-auth/react'

import { SingleEntryForm } from 'app/area/[...slug]/SingleEntryForm'
import { AREA_DESCRIPTION_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'
import { DashboardInput } from '@/components/ui/form/Input'
import useUpdateAreasCmd from '@/js/hooks/useUpdateAreasCmd'

export const AreaNameForm: React.FC<{ initialValue: string, uuid: string }> = ({ uuid, initialValue }) => {
  const session = useSession({ required: true })
  const { updateOneAreaCmd } = useUpdateAreasCmd({
    areaId: uuid,
    accessToken: session?.data?.accessToken as string
  }
  )
  return (
    <SingleEntryForm<{ areaName: string }>
      initialValues={{ areaName: initialValue }}
      submitHandler={({ areaName }) => {
        void updateOneAreaCmd({ areaName })
      }}
    >
      <DashboardInput
        name='areaName'
        label='Area name'
        description='This is the name of the climbing area.'
        helper='Please use 100 characters at maximum.'
        className='w-80'
      />
    </SingleEntryForm>
  )
}
