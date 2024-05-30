'use client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { MobileDialog, DialogContent, DialogTrigger } from '@/components/ui/MobileDialog'

import { SingleEntryForm } from '@/app/(default)/editArea/[slug]/components/SingleEntryForm'
import { AREA_LATLNG_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'
import { DashboardInput } from '@/components/ui/form/Input'
import useUpdateAreasCmd from '@/js/hooks/useUpdateAreasCmd'
import { parseLatLng } from '@/components/crag/cragSummary'
import { CoordinatePickerMap } from '@/components/maps/CoordinatePickerMap'
import { useResponsive } from '@/js/hooks'

export const AreaLatLngForm: React.FC<{ initLat: number, initLng: number, uuid: string, isLeaf: boolean, areaName: string }> = ({ uuid, initLat, initLng, isLeaf, areaName }) => {
  const session = useSession({ required: true })
  const { updateOneAreaCmd } = useUpdateAreasCmd({
    areaId: uuid,
    accessToken: session?.data?.accessToken as string
  })
  const latlngStr = `${initLat.toString()},${initLng.toString()}`
  const [pickerSelected, setPickerSelected] = useState(false)
  const { isMobile } = useResponsive()

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
      {isLeaf
        ? (
          <div className='flex flex-wrap items-end'>
            <div className='pr-1'>
              <DashboardInput
                name='latlngStr'
                label='Coordinates in latitude, longitude format.'
                registerOptions={AREA_LATLNG_FORM_VALIDATION_RULES}
                readOnly={!isLeaf}
              />
            </div>
            <MobileDialog open={pickerSelected} onOpenChange={setPickerSelected}>
              <DialogTrigger asChild>
                <button type='button' onClick={() => setPickerSelected(true)} className='btn btn-link p-0'>
                  Coordinate Picker
                </button>
              </DialogTrigger>
              <DialogContent title={`${areaName}`} fullScreen={!!isMobile}>
                <div className='w-full h-100vh'>
                  <div className='h-[90vh] lg:h-[50vh] w-full'>
                    <CoordinatePickerMap
                      initialCenter={[initLng, initLat]}
                      onCoordinateConfirmed={() => {
                        setPickerSelected(false)
                      }}
                    />
                  </div>
                </div>
              </DialogContent>
            </MobileDialog>
          </div>
          )
        : (
          <p className='text-secondary'>Coordinates field available only when area type is either 'Crag' or 'Boulder'.</p>
          )}
    </SingleEntryForm>
  )
}
