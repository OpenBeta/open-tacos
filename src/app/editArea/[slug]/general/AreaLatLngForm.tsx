'use client'
import { useSession } from 'next-auth/react'

import { SingleEntryForm } from 'app/area/[...slug]/SingleEntryForm'
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
        name='latlng'
        label='Coordinates'
        description='Specify the approximate latitude and longitude. The location may be where the trail meets the wall or in the middle of a long wall.'
        helper='Please use <latitude>, <longitude>'
        className='w-80'
        registerOptions={AREA_LATLNG_FORM_VALIDATION_RULES}
      />
    </SingleEntryForm>
  )
}
