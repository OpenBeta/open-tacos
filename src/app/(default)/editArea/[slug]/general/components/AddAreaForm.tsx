'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { WarningOctagon } from '@phosphor-icons/react/dist/ssr'

import { SingleEntryForm } from '@/app/(default)/editArea/[slug]/components/SingleEntryForm'
import { DashboardInput } from '@/components/ui/form/Input'
import useUpdateAreasCmd from '@/js/hooks/useUpdateAreasCmd'
import { AreaType } from '@/js/types'
import { AreaDesignationRadioGroup, areaDesignationToDb, AreaTypeFormProp } from '@/components/edit/form/AreaDesignationRadioGroup'
import { AREA_NAME_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'

/**
 * Add a new area/crag/boulder
 */
export const AddAreaForm: React.FC<{ area: AreaType }> = ({ area }) => {
  const { uuid, metadata: { isBoulder, leaf: isLeaf } } = area
  const session = useSession({ required: true })
  const router = useRouter()
  const { addOneAreaCmd } = useUpdateAreasCmd({
    areaId: uuid,
    accessToken: session?.data?.accessToken as string
  }
  )
  const notEditable = isBoulder || isLeaf // cannot add new subareas to a leaf area (boulder/crag)
  return (
    <SingleEntryForm<{ areaName: string, areaType: AreaTypeFormProp }>
      initialValues={{ areaName: '' }}
      keepValuesAfterReset={false}
      validationMode='onSubmit'
      alwaysEnableSubmit
      title='Add new area'
      helperText='TIP: Pick &ldquo;AREA&rdquo; type if not sure.  You can change it later.'
      submitHandler={async ({ areaName, areaType }) => {
        const { isBoulder, isLeaf } = areaDesignationToDb(areaType)
        await addOneAreaCmd({ name: areaName, parentUuid: uuid, isBoulder, isLeaf })
        router.refresh() // Ask Next to refresh props from the server
      }}
      className='outline outline-2 outline-accent outline-offset-2'
    >
      {notEditable &&
        <div role='alert' className='alert alert-info'>
          <WarningOctagon size={24} />
          <span>This area is either a crag or a boulder.  Adding new child areas is not allowed.</span>
        </div>}
      <DashboardInput
        name='areaName'
        label='Enter the area name.'
        className='w-full'
        registerOptions={AREA_NAME_FORM_VALIDATION_RULES}
        disabled={notEditable}
      />
      <AreaDesignationRadioGroup disabled={notEditable} />
    </SingleEntryForm>
  )
}
