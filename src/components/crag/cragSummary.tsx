import React, { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useForm, FormProvider } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import * as Portal from '@radix-ui/react-portal'
import { GlobeAltIcon, PencilSquareIcon } from '@heroicons/react/24/outline'

import { AreaMetadataType, CountByGroupType, AreaUpdatableFieldsType } from '../../js/types'
import { IndividualClimbChangeInput, UpdateOneAreaInputType } from '../../js/graphql/gql/contribs'
import EditModeToggle from '../../components/editor/EditModeToggle'
import { FormSaveAction } from '../../components/editor/FormSaveAction'
import Toast from '../../components/ui/Toast'
import { getMapHref, sortClimbsByLeftRightIndex } from '../../js/utils'
import { AREA_NAME_FORM_VALIDATION_RULES, AREA_LATLNG_FORM_VALIDATION_RULES, AREA_DESCRIPTION_FORM_VALIDATION_RULES } from '../edit/EditAreaForm'
import { AreaDesignationRadioGroup, areaDesignationToDb, areaDesignationToForm } from '../edit/form/AreaDesignationRadioGroup'
import { CragLayoutProps } from './cragLayout'
import { ClimbListPreview, findDeletedCandidates } from './ClimbListPreview'
import useUpdateClimbsCmd from '../../js/hooks/useUpdateClimbsCmd'
import useUpdateAreasCmd from '../../js/hooks/useUpdateAreasCmd'

import { DeleteAreaTrigger } from '../edit/DeleteAreaForm'
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
 * This could actually be extended to giving area summaries as well.
 *
 * **Note:** There's no need to wrap backend API calls in a try/catch block
 * because react-hook-form `handleSubmit()` handles it for us and sends exeptions
 * to `onError()` callback.
 */
export default function CragSummary ({ uuid, title: initTitle, description: initDescription, latitude: initLat, longitude: initLng, areaMeta, climbs, ancestors }: CragLayoutProps): JSX.Element {
  const toastRef = useRef<any>(null)
  const session = useSession()

  /**
   * Hold the ref to the delete component.
   * We use Portal to avoid nesting the delete form inside the edit form which causes
   * unwanted submit.
   */
  const [deletePlaceholderRef, setDeletePlaceholderRef] = useState<HTMLElement|null>()

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

  const onUpdateCompleted = (): void => {
    toastRef?.current?.publish('Climbs updated ✨')
  }

  const onUpdateError = (): void => {
    toastRef?.current?.publish('Something unexpected happened. Please save again.', true)
  }

  const { updateClimbCmd, deleteClimbsCmd } = useUpdateClimbsCmd({
    parentId: uuid,
    accessToken: session?.data?.accessToken as string,
    onUpdateCompleted,
    onUpdateError,
    onDeleteCompleted: () => {
      toastRef?.current?.publish('Climbs deleted ✨')
    },
    onDeleteError: (error) => {
      toastRef?.current?.publish(`Unexpected error: ${error?.message as string}`, true)
    }
  })

  const { updateOneAreaCmd: updateAreaCmd } = useUpdateAreasCmd({
    areaId: uuid,
    accessToken: session?.data?.accessToken as string,
    onUpdateCompleted: () => toastRef.current.publish('Area updated ✨'),
    onUpdateError: (error) => toastRef.current.publish(`An unexpected error: ${error?.message as string}`)
  })

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
      toastRef?.current?.publish('Nothing to save.  Please make at least 1 edit.', true)
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
  const latlngPair = parseLatLng(currentLatLngStr)
  const canChangeAreaType = currentClimbList.length === 0 && cache.climbList.length === 0 // we're not allowed to change a crag to an area once it already has climbs
  const showBulkEditor = currentareaType !== 'area'
  const parentAreaId = ancestors[ancestors.length - 2]

  useEffect(() => {
    const div = document.getElementById('deleteButtonPlaceholder')
    if (div != null) {
      setDeletePlaceholderRef(div)
    }
  }, [editMode])

  return (
    <>
      <Portal.Root container={deletePlaceholderRef}>
        <DeleteAreaTrigger areaName={areaName} areaUuid={uuid} parentUuid={parentAreaId} disabled={!canChangeAreaType} />
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
                        href={getMapHref({ lat: latlngPair[0], lng: latlngPair[1] })} target='blank' className='hover:underline text-xs inline-flex items-center gap-2'
                      >
                        <GlobeAltIcon className='w-4 h-4' />
                        {latlngPair[0].toFixed(5)}, {latlngPair[1].toFixed(5)}
                      </a>)
                  )}
              {editMode && (
                <div className='fadeinEffect'>
                  <div className='mt-6'>
                    <h3>Housekeeping</h3>
                    <AreaDesignationRadioGroup canEdit={canChangeAreaType} />
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

          <ClimbListPreview editable={editMode} />

          {editMode && showBulkEditor && (
            <div className='collapse mt-8 collapse-plus fadeinEffect'>
              <input type='checkbox' defaultChecked />
              <div className='px-0 collapse-title flex items-center gap-4'>
                <PencilSquareIcon className='w-12 h-12 rounded-full p-3 bg-secondary shadow-lg' /><span className='underline font-medium'>CSV editor</span>
              </div>
              <div className='px-0 collapse-content'>
                <ClimbBulkEditor name='climbList' initialClimbs={cache.climbList} resetSignal={resetSignal} editable />
              </div>
            </div>)}

          <div className='md:hidden'>
            <FormSaveAction
              cache={cache}
              editMode={editMode}
              isDirty={isDirty}
              isSubmitting={isSubmitting}
              resetHookFn={reset}
              onReset={() => setResetSignal(Date.now())}
            />
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
