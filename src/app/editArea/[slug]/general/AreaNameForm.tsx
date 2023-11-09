'use client'
import { useSession } from 'next-auth/react'

import { SingleEntryForm } from 'app/area/[...slug]/SingleEntryForm'
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
      submitHandler={async ({ areaName }) => {
        await updateOneAreaCmd({ areaName })
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
