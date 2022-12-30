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
import { AREA_NAME_FORM_VALIDATION_RULES, AREA_LATLNG_FORM_VALIDATION_RULES, AREA_DESCRIPTION_FORM_VALIDATION_RULES, AreaTypeRadioGroup } from '../edit/EditAreaForm'
import { CragLayoutProps } from './cragLayout'
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

type SummaryHTMLFormProps = Required<Pick<AreaUpdatableFieldsType, 'areaName' | 'description' >> & { uuid: string, latlng: string, areaType: 'leaf' | 'area' }

type UpdateAPIType = Partial<Required<Pick<AreaUpdatableFieldsType, 'areaName' | 'description' | 'lat' | 'lng' |'isLeaf'>> & { uuid: string }>

/**
 * Responsive summary of major attributes for a crag / boulder.
 * This could actually be extended to giving area summaries as well.
 */
export default function CragSummary ({ uuid, title: initTitle, description: initDescription, latitude: initLat, longitude: initLng, areaMeta, climbs }: CragLayoutProps): JSX.Element {
  const toastRef = useRef<any>(null)
  const session = useSession()
  const [resetSignal, setResetSignal] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [cache, setCache] = useState<SummaryHTMLFormProps>({
    uuid,
    areaName: initTitle,
    description: initDescription,
    latlng: `${initLat.toString()},${initLng.toString()}`,
    areaType: areaMeta.leaf
      ? 'leaf'
      : 'area'
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

  const { handleSubmit, formState: { isSubmitting, isDirty, dirtyFields }, reset, watch } = form

  const currentLatLngStr = watch('latlng')

  const submitHandler = async (formData: SummaryHTMLFormProps): Promise<void> => {
    const { uuid, areaName, description, latlng, areaType } = formData
    const [lat, lng] = latlng.split(',')

    // Extract only dirty fields to send to the API
    const onlyDirtyFields: Partial<UpdateAPIType> = {
      ...dirtyFields?.areaName === true && { areaName },
      ...dirtyFields?.areaType === true && canChangeAreaType && { isLeaf: areaType === 'leaf' },
      ...dirtyFields?.latlng === true && { lat: parseFloat(lat), lng: parseFloat(lng) },
      ...dirtyFields?.description === true && { description }
    }

    await updateArea({
      variables: {
        uuid,
        ...onlyDirtyFields
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
  const canChangeAreaType = climbs.length === 0 // we're not allowed to change a crag to an area once it already has climbs
  return (
    <>
      <div className='flex justify-end'>
        <EditModeToggle onChange={setEditMode} />
      </div>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className='lg:grid lg:grid-cols-3 w-full'>
            <div className='lg:border-r-2 lg:pr-8 border-base-content'>
              <h1 className='text-4xl md:text-5xl'>
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
              {editMode && (
                <div className='mt-6'>
                  <h3 className='tracking-tight'>Housekeeping</h3>
                  <AreaTypeRadioGroup canEdit={canChangeAreaType} />
                </div>

              )}
            </div>
            <div className='lg:col-span-2 lg:pl-16 mb-16 w-full'>
              {/* <div className='flex-1 flex justify-end'>
        // vnguyen: temporarily removed until we have view favorites feature
        <FavouriteButton areaId={props.areaMeta.areaId} />
      </div> */}

              <h3>Description</h3>

              <InplaceEditor
                initialValue={description}
                name='description'
                reset={resetSignal}
                editable={editMode}
                placeholder='Area description'
                rules={AREA_DESCRIPTION_FORM_VALIDATION_RULES}
              />
              <FormSaveAction
                cache={cache}
                editMode={editMode}
                isDirty={isDirty}
                isSubmitting={isSubmitting}
                resetHookFn={reset}
                onReset={() => setResetSignal(Date.now())}
              />
            </div>
          </div>
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
