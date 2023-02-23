import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useForm, FormProvider } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import * as Portal from '@radix-ui/react-portal'
import { MapPinIcon, PencilSquareIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

import { AreaUpdatableFieldsType, AreaType } from '../../js/types'
import { IndividualClimbChangeInput, UpdateOneAreaInputType } from '../../js/graphql/gql/contribs'
import { getMapHref, sortClimbsByLeftRightIndex } from '../../js/utils'
import { AREA_NAME_FORM_VALIDATION_RULES, AREA_LATLNG_FORM_VALIDATION_RULES, AREA_DESCRIPTION_FORM_VALIDATION_RULES } from '../edit/EditAreaForm'
import { AreaDesignationRadioGroupProps, areaDesignationToDb, areaDesignationToForm } from '../edit/form/AreaDesignationRadioGroup'
import { ClimbListPreview, findDeletedCandidates } from './ClimbListPreview'
import useUpdateClimbsCmd from '../../js/hooks/useUpdateClimbsCmd'
import useUpdateAreasCmd from '../../js/hooks/useUpdateAreasCmd'
import { DeleteAreaTrigger } from '../edit/Triggers'
import { AreaCRUD } from '../edit/AreaCRUD'
import { StickyHeader, Skeleton as HeaderSkeleton } from './StickyHeader'
import { InplaceTextInput, InplaceEditor } from '../editor'
import EditModeToggle from '../editor/EditModeToggle'
import { FormSaveActionProps } from '../../components/editor/FormSaveAction'
import { ArticleLastUpdate } from '../edit/ArticleLastUpdate'
import Tooltip from '../ui/Tooltip'
import Grade from '../../js/grades/Grade'

export type AreaSummaryType = Pick<AreaType, 'uuid' | 'areaName' | 'climbs' | 'children' | 'totalClimbs'> & { metadata: Pick<AreaType['metadata'], 'leaf' | 'isBoulder' | 'isDestination'> }

export interface EditableClimbType {
  id: string
  climbId: string
  name: string
  gradeStr?: string
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
export default function CragSummary (props: AreaType): JSX.Element {
  const {
    uuid, areaName: initTitle,
    content: { description: initDescription },
    metadata: areaMeta, climbs, ancestors, pathTokens,
    children: childAreas,
    gradeContext,
    createdAt, createdBy, updatedAt, updatedBy
  } = props

  const { lat: initLat, lng: initLng } = areaMeta

  const router = useRouter()

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
    climbList: sortClimbsByLeftRightIndex(climbs).map(({ id, name, grades, type: disciplines, metadata: { leftRightIndex } }) => ({
      id, // to be used as react key
      climbId: id,
      name,
      gradeStr: (new Grade(gradeContext, grades, disciplines, areaMeta.isBoulder)).toString(),
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

  const onAreaCRUDChangeHandler = (): void => {
    if (editMode) {
      void refetch()
    }
    void router.replace(router.asPath)
  }

  // React-hook-form declaration
  const form = useForm<SummaryHTMLFormProps>({
    mode: 'onBlur',
    defaultValues: { ...cache }
  })

  const { handleSubmit, formState: { dirtyFields }, reset, watch } = form

  const currentLatLngStr = watch('latlng')
  const currentClimbList = watch('climbList')
  const currentareaType = watch('areaType')

  /**
   * Form submit handler
   */
  const submitHandler = async (formData: SummaryHTMLFormProps): Promise<void> => {
    const { uuid, areaName, description, latlng, areaType, climbList } = formData
    const [lat, lng] = latlng.split(',')

    const updatedClimbs = extractDirtyClimbs(dirtyFields?.climbList, climbList, currentareaType === 'boulder')
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

  const FormAction = (
    <ClientSideFormSaveAction
      cache={cache} editMode={editMode} onReset={() => setResetSignal(Date.now())}
    />
  )

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
      const { uuid, areaName, metadata, content, climbs } = data.area
      const { lat, lng } = metadata
      setCache(current => ({
        ...current,
        uuid,
        areaName,
        description: content.description,
        areaType: areaDesignationToForm(metadata),
        latlng: `${lat.toString()},${lng.toString()}`,
        climbList: sortClimbsByLeftRightIndex(climbs).map(({ id, name, grades, type: disciplines, metadata: { leftRightIndex } }) => ({
          id, // to be used as react key
          climbId: id,
          name,
          gradeStr: (new Grade(gradeContext, grades, disciplines, areaMeta.isBoulder)).toString(),
          leftRightIndex
        }))
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
      {deletePlaceholderRef != null &&
        <Portal.Root container={deletePlaceholderRef}>
          {editMode &&
            <DeleteAreaTrigger areaName={areaName} areaUuid={uuid} parentUuid={parentAreaId} disabled={!canChangeAreaType} />}
        </Portal.Root>}

      {addAreaPlaceholderRef != null &&
        <Portal.Root container={addAreaPlaceholderRef}>
          {canAddAreas &&
            <AreaCRUD uuid={uuid} areaName={areaName} childAreas={childAreasCache} onChange={onAreaCRUDChangeHandler} editMode={editMode} />}
        </Portal.Root>}

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)}>

          <StickyHeader
            ancestors={ancestors}
            pathTokens={pathTokens}
            formAction={FormAction}
          />

          <div className='mt-4 text-right' id='editTogglePlaceholder'>
            <EditModeToggle onChange={setEditMode} />
          </div>

          <div className='area-climb-page-summary'>
            <div className='area-climb-page-summary-left'>
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
                    placeholder='Enter a latitude,longitude. Ex: 46.433333,11.85'
                    rules={AREA_LATLNG_FORM_VALIDATION_RULES}
                  />
                : (
                    latlngPair != null && (
                      <div className='flex flex-col text-xs text-base-300 border-t border-b  divide-y'>
                        <a
                          href={getMapHref({ lat: latlngPair[0], lng: latlngPair[1] })} target='blank' className='flex items-center gap-2 py-3'
                        >
                          <MapPinIcon className='w-5 h-5' />
                          <span className='mt-0.5'>
                            <b>LAT,LNG</b>&nbsp;<span className='link-dotted'>{latlngPair[0].toFixed(5)}, {latlngPair[1].toFixed(5)}</span>
                          </span>
                        </a>
                        <ArticleLastUpdate updatedAt={updatedAt} updatedBy={updatedBy} createdAt={createdAt} createdBy={createdBy} />
                      </div>
                    )
                  )}

              {editMode && (
                <div className='fadeinEffect'>
                  <div className='mt-8'>
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
            <div className='area-climb-page-summary-right'>
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

          <div className='mt-4 block lg:hidden'>
            {/* Mobile-only */}
            {FormAction}
          </div>

          {canAddAreas &&
            <div className='block mt-16 min-h-[8rem]' id='addAreaPlaceholder' />}

          {canAddClimbs && <ClimbListPreview editable={editMode} />}

          {editMode && canAddClimbs && (
            <div className='collapse mt-12 fadeinEffect flex flex-col gap-4'>
              <div className='flex items-center gap-4'>
                <PencilSquareIcon className='w-8 h-8 rounded-full p-2 bg-secondary shadow-lg' />
                <span className='font-semibold text-base-300'>CSV Editor</span>
                <EditorTooltip />
              </div>
              <ClimbBulkEditor name='climbList' initialClimbs={cache.climbList} resetSignal={resetSignal} editable />
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
 */
const extractDirtyClimbs = (dirtyFields: ClimbDirtyFieldsType[] = [], climbList: EditableClimbType[], isBoulder: boolean): IndividualClimbChangeInput[] => {
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
      ...dirtyObj?.id === true && { leftRightIndex }, // Include ordering index if array index has changed
      ...isBoulder && { disciplines: { bouldering: true } }
    })
    return acc
  }, [])
  return updateList
}

const EditorTooltip: React.FC = () => (
  <Tooltip content={
    <ul className='px-4 py-2 list-disc space-y-2'>
      <li>
        <strong>Create new climbs</strong><br /> Enter one climb per line
      </li>
      <li>
        <strong>Delete climbs</strong><br />Delete the entire line
      </li>
      <li>
        <strong>Set difficulty/grade</strong><br />Coming soon!
      </li>
      <li>
        <strong>Change left-to-right order</strong><br />Copy-n-paste lines
      </li>
      <li>
        <strong>Climb ID</strong><br />Don't edit the strange text: <i>646756eb-7552-4715-8e17-d4c1073b5d51</i>
      </li>
      <li>
        Remember to press <strong>Save</strong> when done 😀
      </li>
    </ul>
    }
  >
    <div className='flex items-center gap-2 text-xs'><span className='link-dotted'>Help</span><QuestionMarkCircleIcon className='text-info w-5 h-5' /></div>
  </Tooltip>)

/**
 * Area/climb main skeleton
 */
export const Skeleton: React.FC = () => (
  <div>
    <HeaderSkeleton />
    <div className='mt-4 text-right'>
      <EditModeToggle onChange={() => {}} showSkeleton />
    </div>
    <div className='area-climb-page-summary'>
      <div className='area-climb-page-summary-left'>
        <h1 className='text-4xl md:text-5xl rounded-box bg-base-200/10 w-72'>&nbsp;</h1>
      </div>
      <div className='area-climb-page-summary-right'>
        <h3 className='rounded-box bg-base-200/10 w-48'>&nbsp;</h3>
        <div className='mt-4 rounded-box bg-base-200/10 w-full h-80' />
      </div>
    </div>
  </div>)

export const ClientSideFormSaveAction = dynamic<FormSaveActionProps>(async () => await import('../../components/editor/FormSaveAction').then(module => module.FormSaveAction), {
  ssr: false
})

const ClimbBulkEditor = dynamic(async () => await import('../editor/CsvEditor'))

const AreaDesignationRadioGroup = dynamic<AreaDesignationRadioGroupProps>(async () => await import('../edit/form/AreaDesignationRadioGroup').then(module => module.AreaDesignationRadioGroup))
