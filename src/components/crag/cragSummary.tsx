import React, { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useForm, FormProvider } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@apollo/client'

import { AreaMetadataType, CountByGroupType, AreaUpdatableFieldsType } from '../../js/types'
import EditModeToggle from '../../components/editor/EditModeToggle'
import { FormSaveAction } from '../../components/editor/FormSaveAction'
import { MUTATION_UPDATE_AREA, UpdateAreaReturnType } from '../../js/graphql/gql/contribs'
import { graphqlClient } from '../../js/graphql/Client'
import Toast from '../../components/ui/Toast'
import { getMapHref } from '../../js/utils'
import { AREA_NAME_FORM_VALIDATION_RULES, AREA_LATLNG_FORM_VALIDATION_RULES, AREA_DESCRIPTION_FORM_VALIDATION_RULES } from '../edit/EditAreaForm'
// import FavouriteButton from '../users/FavouriteButton'

export interface CragHeroProps {
  uuid: string
  title: string
  latitude: number
  longitude: number
  description: string
  galleryRef?: string
  aggregate: CountByGroupType[]
  media: any[]
  areaMeta: AreaMetadataType
}

type SummaryHTMLFormProps = Required<Pick<AreaUpdatableFieldsType, 'areaName' | 'description'>> & { uuid: string, latlng: string }

type UpdateAPIType = Required<Pick<AreaUpdatableFieldsType, 'areaName' | 'description' | 'lat' | 'lng'>> & { uuid: string }

/**
 * Responsive summary of major attributes for a crag / boulder.
 * This could actually be extended to giving area summaries as well.
 */
export default function CragSummary ({ uuid, title: initTitle, description: initDescription, latitude: initLat, longitude: initLng }: CragHeroProps): JSX.Element {
  const toastRef = useRef<any>(null)
  const session = useSession()
  const [resetSignal, setResetSignal] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [cache, setCache] = useState<SummaryHTMLFormProps>({
    uuid,
    areaName: initTitle,
    description: initDescription,
    latlng: `${initLat.toString()},${initLng.toString()}`
  })

  const [updateArea] = useMutation<{ updateArea: UpdateAreaReturnType }, UpdateAPIType>(
    MUTATION_UPDATE_AREA, {
      client: graphqlClient,
      onCompleted: () => {
        void fetch(`/api/revalidate?s=${uuid}`)
        toastRef?.current?.publish('Changes saved.  Thank you for your contribution! ✨')
      },
      onError: (error) => {
        console.log(error)
        toastRef?.current?.publish('Something unexpected happened. Please save again.', true)
      }
    }
  )

  // Form declaration
  const form = useForm<SummaryHTMLFormProps>(
    {
      mode: 'onBlur',
      defaultValues: { ...cache }
    })

  const { handleSubmit, formState: { isSubmitting, isDirty }, reset, watch } = form

  const currentLatLngStr = watch('latlng')

  const submitHandler = async (formData: SummaryHTMLFormProps): Promise<void> => {
    const { uuid, areaName, description, latlng } = formData
    const [lat, lng] = latlng.split(',')
    await updateArea({
      variables: {
        uuid,
        areaName,
        description,
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      },
      context: {
        headers: {
          authorization: `Bearer ${session?.data?.accessToken as string ?? ''}`
        }
      }
    })
    setCache({ ...formData })
    reset(formData, { keepValues: true })
  }

  const { areaName, description } = cache
  const latlngPair = parseLatLng(currentLatLngStr)
  return (
    <>
      <div className='flex justify-end'>
        <EditModeToggle onChange={setEditMode} />
      </div>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <h1 className='mt-4 text-3xl md:text-4xl lg:text-5xl font-bold lg:max-w-lg'>
            <InplaceTextInput
              initialValue={areaName}
              name='areaName'
              reset={resetSignal}
              editable={editMode}
              placeholder='Area name'
              rules={AREA_NAME_FORM_VALIDATION_RULES}
            />
          </h1>

          {editMode
            ? <InplaceTextInput
                initialValue={currentLatLngStr}
                name='latlng'
                reset={resetSignal}
                editable={editMode}
                className='text-xs'
                placeholder='Enter a latitude,longitude. Ex: 46.433333,11.85'
                rules={AREA_LATLNG_FORM_VALIDATION_RULES}
              />
            : (
                latlngPair != null && (
                  <a
                    href={getMapHref({ lat: latlngPair[0], lng: latlngPair[1] })} target='blank' className='hover:underline
              text-xs inline-flex items-center gap-2'
                  >
                    <GlobeAltIcon className='w-4 h-4' />
                    {latlngPair[0].toFixed(5)}, {latlngPair[1].toFixed(5)}
                  </a>)
              )}

          {/* <div className='flex-1 flex justify-end'>
        // vnguyen: temporarily removed until we have view favorites feature
        <FavouriteButton areaId={props.areaMeta.areaId} />
      </div> */}

          <div className='mt-6'>
            <InplaceEditor
              initialValue={description}
              name='description'
              reset={resetSignal}
              editable={editMode}
              placeholder='Area description'
              rules={AREA_DESCRIPTION_FORM_VALIDATION_RULES}
            />
          </div>
          <FormSaveAction
            cache={cache}
            editMode={editMode}
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            resetHookFn={reset}
            onReset={() => setResetSignal(Date.now())}
          />
        </form>
      </FormProvider>
      <Toast ref={toastRef} />
    </>
  )
}

/**
 * Split lat,lng string into lat and lng tuple.  Return null if string is invalid.
 */
const parseLatLng = (s: string): [number, number] | null => {
  const [latStr, lngStr] = s.split(',')
  const lat = parseFloat(latStr)
  const lng = parseFloat(lngStr)
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null
  }
  return [lat, lng]
}

const InplaceEditor = dynamic(async () => await import('../../components/editor/InplaceEditor'), {
  ssr: false
})

const InplaceTextInput = dynamic(async () => await import('../../components/editor/InplaceTextInput'), {
  ssr: false
})
