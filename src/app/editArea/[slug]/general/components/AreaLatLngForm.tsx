'use client'
import { useSession } from 'next-auth/react'

import { SingleEntryForm } from 'app/editArea/[slug]/components/SingleEntryForm'
import { AREA_LATLNG_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'
import { DashboardInput } from '@/components/ui/form/Input'
import useUpdateAreasCmd from '@/js/hooks/useUpdateAreasCmd'
import { parseLatLng } from '@/components/crag/cragSummary'

export const AreaLatLngForm: React.FC<{ initLat: number, initLng: number, uuid: string }> = ({ uuid, initLat, initLng }) => {
  const session = useSession({ required: true })
  const { updateOneAreaCmd } = useUpdateAreasCmd({
    areaId: uuid,
    accessToken: session?.data?.accessToken as string
  }
  )
  const latlngStr = `${initLat.toString()},${initLng.toString()}`
  return (
    <SingleEntryForm<{ latlngStr: string }>
      initialValues={{ latlngStr }}
      title='Coordinates'
      helperText='The location may be where the trail meets the wall or the midpoint of the wall.'
      submitHandler={({ latlngStr }) => {
        const latlng = parseLatLng(latlngStr)
        if (latlng != null) {
          void updateOneAreaCmd({ lat: latlng[0], lng: latlng[1] })
        } else {
          console.error('# form validation should catch this error')
        }
      }}
    >
      <DashboardInput
        name='latlngStr'
        label='Coordinates in latitude, longitude format.'
        className='w-80'
        registerOptions={AREA_LATLNG_FORM_VALIDATION_RULES}
      />
    </SingleEntryForm>
  )
}
