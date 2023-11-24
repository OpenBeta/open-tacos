'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { SingleEntryForm } from 'app/editArea/[slug]/components/SingleEntryForm'
import { DashboardInput } from '@/components/ui/form/Input'
import useUpdateAreasCmd from '@/js/hooks/useUpdateAreasCmd'
import { AreaType } from '@/js/types'
import { AreaDesignationRadioGroup, areaDesignationToDb, AreaTypeFormProp } from '@/components/edit/form/AreaDesignationRadioGroup'
import { AREA_NAME_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'

/**
 * Add a new area/crag/boulder
 */
export const AddAreaForm: React.FC<{ area: AreaType }> = ({ area }) => {
  const { uuid } = area
  const session = useSession({ required: true })
  const router = useRouter()
  const { addOneAreaCmd } = useUpdateAreasCmd({
    areaId: uuid,
    accessToken: session?.data?.accessToken as string
  }
  )
  return (
    <SingleEntryForm<{ areaName: string, areaType: AreaTypeFormProp }>
      initialValues={{ areaName: '' }}
      keepValuesAfterReset={false}
      title='Add new area'
      helperText='Do not copy description from guidebooks.'
      submitHandler={async ({ areaName, areaType }) => {
        const { isBoulder, isLeaf } = areaDesignationToDb(areaType)
        await addOneAreaCmd({ name: areaName, parentUuid: uuid, isBoulder, isLeaf })
        router.refresh() // Ask Next to refresh props from the server
      }}
      className='outline outline-2 outline-accent outline-offset-2'
    >
      <DashboardInput
        name='areaName'
        label='Enter the area name.'
        className='w-full'
        registerOptions={AREA_NAME_FORM_VALIDATION_RULES}
      />
      <AreaDesignationRadioGroup disabled={false} />
    </SingleEntryForm>
  )
}
