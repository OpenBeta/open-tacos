'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { SingleEntryForm } from 'app/editArea/[slug]/components/SingleEntryForm'
import useUpdateAreasCmd from '@/js/hooks/useUpdateAreasCmd'
import { AreaType } from '@/js/types'
import { AreaDesignationRadioGroup, areaDesignationToDb, areaDesignationToForm, AreaTypeFormProp } from '@/components/edit/form/AreaDesignationRadioGroup'

/**
 * Set area type: general area | crag | boulder
 */
export const AreaTypeForm: React.FC<{ area: AreaType }> = ({ area }) => {
  const { uuid, climbs, children } = area
  const session = useSession({ required: true })
  const router = useRouter()
  const { updateOneAreaCmd } = useUpdateAreasCmd({
    areaId: uuid,
    accessToken: session?.data?.accessToken as string
  }
  )

  const areaType = areaDesignationToForm(area.metadata)

  // we're allowed to change area designation when the area has neither climbs nor areas.
  const canChangeAreaType =
    climbs.length === 0 &&
    children.length === 0
  return (
    <SingleEntryForm<{ areaType: AreaTypeFormProp }>
      initialValues={{ areaType }}
      keepValuesAfterReset={false}
      title='Area Type'
      helperText='You can not change the type if this area contains subareas or climbs.'
      submitHandler={async ({ areaType }) => {
        const { isBoulder, isLeaf } = areaDesignationToDb(areaType)
        await updateOneAreaCmd({ uuid, isBoulder, isLeaf })
        router.refresh() // Ask Next to refresh props from the server
      }}
    >
      <AreaDesignationRadioGroup disabled={!canChangeAreaType} />
    </SingleEntryForm>
  )
}
