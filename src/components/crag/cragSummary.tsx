import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useForm, FormProvider } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import * as Portal from '@radix-ui/react-portal'
import { MapPinIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

import { AreaMetadataType, CountByGroupType, AreaUpdatableFieldsType } from '../../js/types'
import { IndividualClimbChangeInput, UpdateOneAreaInputType } from '../../js/graphql/gql/contribs'
import EditModeToggle from '../../components/editor/EditModeToggle'
import { FormSaveAction } from '../../components/editor/FormSaveAction'
import { getMapHref, sortClimbsByLeftRightIndex } from '../../js/utils'
import { AREA_NAME_FORM_VALIDATION_RULES, AREA_LATLNG_FORM_VALIDATION_RULES, AREA_DESCRIPTION_FORM_VALIDATION_RULES } from '../edit/EditAreaForm'
import { AreaDesignationRadioGroup, areaDesignationToDb, areaDesignationToForm } from '../edit/form/AreaDesignationRadioGroup'
import { ClimbListPreview, findDeletedCandidates } from './ClimbListPreview'
import useUpdateClimbsCmd from '../../js/hooks/useUpdateClimbsCmd'
import useUpdateAreasCmd from '../../js/hooks/useUpdateAreasCmd'
import { DeleteAreaTrigger } from '../edit/Triggers'
import { AreaCRUD } from '../edit/AreaCRUD'
import { CragLayoutProps } from './cragLayout'

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

export interface EditableClimbType {
  id: string
  climbId: string
  name: string
  yds: string
  leftRightIndex: number
  error?: string
  isNew?: boolean
}

type BulkClimbList = EditableClimbType[]

type AreaTypeFormProp = 'crag' | 'area' | 'boulder'

type SummaryHTMLFormProps = Required<Pick<AreaUpdatableFieldsType, 'areaName' | 'description'>> & { uuid: string, latlng: string, areaType: AreaTypeFormProp, climbList: BulkClimbList }

/**
 * Responsive summary of major attributes for a crag / boulder.
 *
 * **Note:** There's no need to wrap backend API calls in a try/catch block
 * because react-hook-form `handleSubmit()` handles it for us and sends exeptions
 * to `onError()` callback.
 */
export default function CragSummary (props: CragLayoutProps): JSX.Element {
  const {
    uuid, title: initTitle,
    description: initDescription,
    latitude: initLat, longitude: initLng,
    areaMeta, climbs, ancestors,
    childAreas
  } = props

  const session = useSession()

  /**
   * Hold the ref to the area add & delete components.
   * We use Portal to avoid nesting the add/delete form inside the Edit form which causes
   * unwanted submit.
   */
  const [deletePlaceholderRef, setDeletePlaceholderRef] = useState<HTMLElement|null>()
  const [addAreaPlaceholderRef, setAddAreaPlaceholderRef] = useState<HTMLElement|null>()

  /**
   * Change this value will trigger a form control reset to Lexical-backed components.
   * We use Lexical to build inplace editing components and I don't know of a good way
   * to imperatively reset/clear Lexical content without resorting to complicated ref
   * forwarding.
   * As a workaround (maybe this is how you're supposed to do it) there's a custom
   * Lexical plugin that reacts to resetSignal change in useEffect() and resets Lexical
   * content.
   */
  const [resetSignal, setResetSignal] = useState(0)

  const [editMode, setEditMode] = useState(false)

  /**
   * False during SSR or Next build.
   */
  const [clientSide, setClientSide] = useState(false)

  /**
   * A working copy of child areas that can be updated client side.
   * Initially set to the childAreas prop coming from Next build, the cache
   * may be updated by the users in the AreaCRUD component.
   */
  const [childAreasCache, setChildAreasCache] = useState(childAreas)

  /**
   * Hold the form base states aka default values.  Since we use Next SSG,
   * this component props become stale the moment a user submits a change.
   * Every time a user submits the form, this cache needs to be updated.
   */
  const [cache, setCache] = useState<SummaryHTMLFormProps>({
    uuid,
    areaName: initTitle,
    description: initDescription,
    latlng: `${initLat.toString()},${initLng.toString()}`,
    areaType: areaDesignationToForm(areaMeta),
    climbList: sortClimbsByLeftRightIndex(climbs).map(({ id, name, yds, metadata: { leftRightIndex } }) => ({
      id, // to be used as react key
      climbId: id,
      name,
      yds,
      leftRightIndex
    }))
  })

  const { updateClimbCmd, deleteClimbsCmd } = useUpdateClimbsCmd({
    parentId: uuid,
    accessToken: session?.data?.accessToken as string
  })

  const { updateOneAreaCmd: updateAreaCmd, getAreaByIdCmd } = useUpdateAreasCmd({
    areaId: uuid,
    accessToken: session?.data?.accessToken as string
  })

  const { data, refetch } = getAreaByIdCmd({ skip: !clientSide || !editMode })

  // Form declaration
  const form = useForm<SummaryHTMLFormProps>({
    mode: 'onBlur',
    defaultValues: { ...cache }
  })

  const { handleSubmit, formState: { isSubmitting, isDirty, dirtyFields }, reset, watch } = form

  const currentLatLngStr = watch('latlng')
  const currentClimbList = watch('climbList')
  const currentareaType = watch('areaType')

  /**
   * Form submit handler
   */
  const submitHandler = async (formData: SummaryHTMLFormProps): Promise<void> => {
    const { uuid, areaName, description, latlng, areaType, climbList } = formData
    const [lat, lng] = latlng.split(',')

    const updatedClimbs = extractDirtyClimbs(dirtyFields?.climbList, climbList, cache.climbList)
    const deleteCandidiates = findDeletedCandidates(cache.climbList, climbList)

    // Extract only dirty fields to send to the Update Area API
    const onlyDirtyFields: UpdateOneAreaInputType = {
      ...dirtyFields?.areaName === true && { areaName },
      ...dirtyFields?.areaType === true && canChangeAreaType && areaDesignationToDb(areaType),
      ...dirtyFields?.latlng === true && { lat: parseFloat(lat), lng: parseFloat(lng) },
      ...dirtyFields?.description === true && { description }
    }

    /**
     * Submit button should be disabled (this submitHandler() can't be triggered) when the
     * form's global dirty flag is false.
     * We still double-check here just in case things fall through the cracks.
     */
    const isCragSummaryDirty = Object.keys(onlyDirtyFields).length > 0
    const isClimbListDirty = updatedClimbs.length > 0
    const hasSomethingToDelete = deleteCandidiates.length > 0

    if (!isCragSummaryDirty && !isClimbListDirty && !hasSomethingToDelete) {
      toast.warn('Nothing to save.  Please make at least 1 edit.')
      return
    }

    if (hasSomethingToDelete) {
      const idList = deleteCandidiates.map(entry => entry.climbId)
      await deleteClimbsCmd(idList)
    }

    // Send climb updates to backend
    if (isClimbListDirty) {
      await updateClimbCmd({
        parentId: uuid,
        changes: updatedClimbs
      })
    }

    // Send crag updates to backend
    if (isCragSummaryDirty) {
      await updateAreaCmd({
        ...onlyDirtyFields
      })
    }
    setCache({ ...formData })
    reset(formData, { keepValues: true })
  }

  const { areaName, description } = cache
  const parentAreaId = ancestors[ancestors.length - 2]
  const latlngPair = parseLatLng(currentLatLngStr)

  // we're allowed to change area designation when the area has neither climbs nor areas.
  const canChangeAreaType = currentClimbList.length === 0 && cache.climbList.length === 0 && childAreasCache.length === 0

  const canAddAreas = (currentareaType === 'area' || cache.areaType === 'area') && cache.climbList.length === 0
  const canAddClimbs = !canAddAreas

  /**
   * Update refs to divs inside the main form
   */
  useEffect(() => {
    const deleteAreaDiv = document.getElementById('deleteButtonPlaceholder')
    if (deleteAreaDiv != null) {
      setDeletePlaceholderRef(deleteAreaDiv)
    }
    const addAreaDiv = document.getElementById('addAreaPlaceholder')
    if (addAreaDiv != null) {
      setAddAreaPlaceholderRef(addAreaDiv)
    }
  }, [editMode, canAddAreas])

  /**
   * We're in edit mode so let's update local cache with new data from the DB
   */
  useEffect(() => {
    if (data?.area != null) {
      setChildAreasCache(data.area.children)
      const { uuid, areaName, metadata, content } = data.area
      const { lat, lng } = metadata
      setCache(current => ({
        ...current,
        uuid,
        areaName,
        description: content.description,
        areaType: areaDesignationToForm(metadata),
        latlng: `${lat.toString()},${lng.toString()}`
      }))
    }
  }, [data?.area])

  /**
   * Enable clientSide flag so that we can re-fetch child areas from the DB
   */
  useEffect(() => {
    setClientSide(true)
  }, [])

  return (
    <>
      <Portal.Root container={deletePlaceholderRef}>
        {editMode &&
          <DeleteAreaTrigger areaName={areaName} areaUuid={uuid} parentUuid={parentAreaId} disabled={!canChangeAreaType} />}
      </Portal.Root>
      <Portal.Root container={addAreaPlaceholderRef}>
        {canAddAreas &&
          <AreaCRUD uuid={uuid} areaName={areaName} childAreas={childAreasCache} onChange={refetch} editMode={editMode} />}
      </Portal.Root>

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
                        href={getMapHref({ lat: latlngPair[0], lng: latlngPair[1] })} target='blank' className='hover:underline text-xs inline-flex items-center gap-1'
                      >
                        <MapPinIcon className='w-4 h-4' />
                        <span className='mt-0.5'>{latlngPair[0].toFixed(5)}, {latlngPair[1].toFixed(5)}</span>
                      </a>)
                  )}

              {editMode && (
                <div className='fadeinEffect'>
                  <div className='mt-6'>
                    <h3>Housekeeping</h3>
                    <AreaDesignationRadioGroup disabled={!canChangeAreaType} />
                  </div>
                  <div className='mt-6 form-control'>
                    <label className='label'>
                      <span className='label-text font-semibold'>Permanently delete this area</span>
                    </label>
                    <div className='ml-2' id='deleteButtonPlaceholder' />
                  </div>
                </div>)}
            </div>
            <div className='mt-6 lg:mt-0 lg:col-span-2 lg:pl-16 w-full'>
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
            </div>
          </div>

          <FormSaveAction
            cache={cache}
            editMode={editMode}
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            resetHookFn={reset}
            onReset={() => setResetSignal(Date.now())}
          />

          {canAddAreas &&
            <div className='block mt-16 min-h-[8rem]' id='addAreaPlaceholder' />}

          {canAddClimbs && <ClimbListPreview editable={editMode} />}

          {editMode && canAddClimbs && (
            <div className='collapse mt-12 collapse-plus fadeinEffect'>
              <input type='checkbox' defaultChecked />
              <div className='px-0 collapse-title flex items-center gap-4'>
                <PencilSquareIcon className='w-8 h-8 rounded-full p-2 bg-secondary shadow-lg' />
                <span className='font-semibold text-base-300'>CSV Editor</span>
              </div>
              <div className='px-0 collapse-content'>
                <ClimbBulkEditor name='climbList' initialClimbs={cache.climbList} resetSignal={resetSignal} editable />
              </div>
            </div>)}
        </form>
      </FormProvider>
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

type ClimbDirtyFieldsType = Partial<Record<keyof EditableClimbType, boolean>>

/**
 * Use react-hook-form's dirty field flags to return only updated fields
 * @param dirtyFields See react-hook-form
 * @param climbList Active list extracted from form
 * @param cacheList Cache/default list
 * @returns
 */
const extractDirtyClimbs = (dirtyFields: ClimbDirtyFieldsType[] = [], climbList: EditableClimbType[], cacheList: EditableClimbType[]): IndividualClimbChangeInput[] => {
  // Reduce climb list in html form to list of objects compatible with `updateClimbs` API
  const updateList = climbList.reduce<IndividualClimbChangeInput[]>((acc, curr, index) => {
    const dirtyObj = dirtyFields?.[index] ?? {}
    if (Object.keys(dirtyObj).length === 0) {
      // Climb object unchanged, skip
      return acc
    }

    // There's a change
    const { climbId, name, leftRightIndex } = curr
    acc.push({
      id: climbId, // A new random ID will add as a new climb
      ...dirtyObj?.name === true && { name }, // Include name if changed
      ...dirtyObj?.id === true && { leftRightIndex } // Include ordering index if array index has changed
    })
    return acc
  }, [])
  return updateList
}

const InplaceEditor = dynamic(async () => await import('../../components/editor/InplaceEditor'), {
  ssr: false
})

const InplaceTextInput = dynamic(async () => await import('../../components/editor/InplaceTextInput'), {
  ssr: false
})

const ClimbBulkEditor = dynamic(async () => await import('../../components/editor/CsvEditor'), {
  ssr: false
})
