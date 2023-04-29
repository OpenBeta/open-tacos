import React, { useState, useEffect } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { gql } from '@apollo/client'
import { useForm, FormProvider } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import * as Portal from '@radix-ui/react-portal'
import { useHotkeys } from 'react-hotkeys-hook'
import { useSwipeable } from 'react-swipeable'
import { toast } from 'react-toastify'
import ArrowVertical from '../../assets/icons/arrow-vertical.svg'

import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import { AreaType, ClimbDisciplineRecord, ClimbType, MediaWithTags, RulesType } from '../../js/types'
import SeoTags from '../../components/SeoTags'
import RouteGradeChip from '../../components/ui/RouteGradeChip'
import RouteTypeChips from '../../components/ui/RouteTypeChips'
import PhotoMontage, { Skeleton as PhotoMontageSkeleton } from '../../components/media/PhotoMontage'
import { useClimbSeo } from '../../js/hooks/seo/useClimbSeo'
import TickButton from '../../components/users/TickButton'
import { ImportFromMtnProj } from '../../components/users/ImportFromMtnProj'
import EditModeToggle from '../../components/editor/EditModeToggle'
import { AREA_NAME_FORM_VALIDATION_RULES } from '../../components/edit/EditAreaForm'
import useUpdateClimbsCmd from '../../js/hooks/useUpdateClimbsCmd'
import { StickyHeader } from '../../components/crag/StickyHeader'
import { ClientSideFormSaveAction, Skeleton as ContentSkeleton } from '../../components/crag/cragSummary'
import { ArticleLastUpdate } from '../../components/edit/ArticleLastUpdate'
import { TradSportGradeInput, BoulderingGradeInput } from '../../components/edit/form/GradeTextInput'
import Grade from '../../js/grades/Grade'
import { removeTypenameFromDisciplines } from '../../js/utils'
import { TotalLengthInput } from '../../components/edit/form/TotalLengthInput'
import { LegacyFAInput } from '../../components/edit/form/LegacyFAInput'
import { getClimbById } from '../../js/graphql/api'

export const CLIMB_DESCRIPTION_FORM_VALIDATION_RULES: RulesType = {
  maxLength: {
    value: 3500,
    message: 'Maxium 3500 characters.'
  }
}

export const CLIMB_LOCATION_FORM_VALIDATION_RULES: RulesType = {
  maxLength: {
    value: 3500,
    message: 'Maxium 3500 characters.'
  }
}

export const CLIMB_PROTECTON_FORM_VALIDATION_RULES: RulesType = {
  maxLength: {
    value: 800,
    message: 'Maxium 800 characters.'
  }
}
interface ClimbPageProps {
  climb: ClimbType
  leftClimb: ClimbType | null
  rightClimb: ClimbType | null
  showSkeleton?: boolean
}

const ClimbPage: NextPage<ClimbPageProps> = (props: ClimbPageProps) => {
  const { isFallback: showSkeleton } = useRouter()
  return (
    <>
      {!showSkeleton && <PageMeta {...props} />}
      <Layout
        showFilterBar={false}
        contentContainerClass='content-default'
      >
        <article className='article'>
          {showSkeleton
            ? (
              <>
                <PhotoMontageSkeleton />
                <div className='mt-6'>
                  <ContentSkeleton />
                </div>
              </>)
            : (
              <Body {...props} />
              )}
        </article>
      </Layout>
    </>

  )
}

export default ClimbPage

export interface ClimbEditFormProps {
  name: string
  description: string
  location: string
  protection: string
  gradeStr: string
  disciplines: ClimbDisciplineRecord
  legacyFA: string
  length?: number
}

const Body = ({ climb, leftClimb, rightClimb }: ClimbPageProps): JSX.Element => {
  const {
    id, name, fa: legacyFA, length, yds, grades, type, content, safety, metadata, ancestors, pathTokens, createdAt, createdBy, updatedAt, updatedBy,
    parent
  } = climb
  const { climbId } = metadata

  const gradesObj = new Grade(parent.gradeContext, grades, type, parent.metadata.isBoulder)

  const [editTogglePlaceholderRef, setEditTogglePlaceholderRef] = useState<HTMLElement|null>()

  const [editMode, setEditMode] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)
  const [cache, setCache] = useState({ name, ...content, legacyFA, ...length > 0 && { length }, disciplines: removeTypenameFromDisciplines(type), gradeStr: gradesObj.toString() })

  const router = useRouter()
  const session = useSession()

  /**
   * Update refs to divs inside the main form
   */
  useEffect(() => {
    const editToggleDiv = document.getElementById('editTogglePlaceholder')
    if (editToggleDiv != null) {
      setEditTogglePlaceholderRef(editToggleDiv)
    }
  }, [editMode])

  useState([leftClimb, rightClimb])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      leftClimb !== null && router.push(`/climbs/${leftClimb.id}`)
    },
    onSwipedRight: () => {
      rightClimb !== null && router.push(`/climbs/${rightClimb.id}`)
    },
    swipeDuration: 250,
    // touchEventOptions: { passive: true },
    preventScrollOnSwipe: false
  }
  )
  useHotkeys('left', () => {
    leftClimb !== null && router.push(`/climbs/${leftClimb.id}`)
  }, [leftClimb])
  useHotkeys('right', () => {
    rightClimb !== null && router.push(`/climbs/${rightClimb.id}`)
  }, [rightClimb])

  const parentId = ancestors[ancestors.length - 1]

  const { updateClimbCmd } = useUpdateClimbsCmd({
    parentId,
    accessToken: session?.data?.accessToken as string,
    onUpdateCompleted: async () => {
      await router.replace(router.asPath)
    }
  })

  // React hook form declaration
  const form = useForm<ClimbEditFormProps>({
    mode: 'onChange',
    defaultValues: { ...cache }
  })

  const { handleSubmit, reset, formState: { dirtyFields }, watch } = form

  const disciplinesField = watch('disciplines')
  const isBouldering = parent.metadata.isBoulder || (disciplinesField.bouldering && !(disciplinesField.trad || disciplinesField.sport || disciplinesField.aid))

  const submitHandler = async (formData: ClimbEditFormProps): Promise<void> => {
    const { description, location, protection, name, gradeStr, disciplines, length, legacyFA } = formData

    const onlyDirtyFields: Partial<ClimbEditFormProps> = {
      ...dirtyFields?.name === true && { name },
      ...dirtyFields?.description === true && { description },
      ...dirtyFields?.location === true && { location },
      ...dirtyFields?.protection === true && { protection },
      ...dirtyFields?.gradeStr === true && disciplines != null && { grade: gradeStr, disciplines },
      ...length != null && length > 0 && { length },
      ...legacyFA != null && { fa: legacyFA.trim() }
    }

    if (Object.values(dirtyFields?.disciplines ?? []).some(value => value && true)) {
      onlyDirtyFields.disciplines = disciplines
    }

    if (dirtyFields?.gradeStr === true && isBouldering) {
      onlyDirtyFields.disciplines = { ...disciplines, bouldering: true }
    }

    if (Object.keys(onlyDirtyFields).length === 0) {
      toast.warn('Nothing to save.  Please make at least 1 edit.')
      return
    }
    const input = {
      parentId: ancestors[ancestors.length - 1],
      changes: [{ id, ...onlyDirtyFields }]
    }

    await updateClimbCmd(input)
    setCache({ ...formData })
    reset(formData, { keepValues: true })
  }

  const FormAction = (
    <ClientSideFormSaveAction
      cache={cache}
      editMode={editMode}
      onReset={() => setResetSignal(Date.now())}
    />
  )

  return (
    <div {...swipeHandlers}>
      <Portal.Root container={editTogglePlaceholderRef}>
        <EditModeToggle onChange={setEditMode} />
      </Portal.Root>

      <PhotoMontage photoList={climb.media} />

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)} className='mt-6 first:mt-0'>

          <StickyHeader
            isClimbPage
            ancestors={ancestors}
            pathTokens={pathTokens}
            formAction={FormAction}
          />

          <div className='mt-4 text-right' id='editTogglePlaceholder' />

          <div className='area-climb-page-summary'>
            <div
              id='Title Information'
              className='area-climb-page-summary-left'
            >

              <h1 className='text-4xl md:text-5xl mr-10'>
                <InplaceTextInput
                  reset={resetSignal}
                  name='name'
                  editable={editMode}
                  initialValue={cache.name}
                  placeholder='Climb name'
                  rules={AREA_NAME_FORM_VALIDATION_RULES}
                />
              </h1>
              <div className='mt-6'>
                {editMode && isBouldering &&
                  <BoulderingGradeInput gradeObj={gradesObj} />}
                {editMode && !isBouldering &&
                  <TradSportGradeInput gradeObj={gradesObj} />}
                <div className='flex items-center space-x-2 w-full'>
                  {!editMode && cache.gradeStr != null && <RouteGradeChip gradeStr={cache.gradeStr} safety={safety} />}
                  {!editMode && <RouteTypeChips type={disciplinesField} />}
                </div>

                {length !== -1 && !editMode && (
                  <div className='mt-6 inline-flex items-center justify-left border-2 border-neutral/80 rounded'>
                    <ArrowVertical className='h-5 w-5' />
                    <span className='bg-neutral/80 text-base-100 px-2 text-sm'>{length}m</span>
                  </div>
                )}
                {editMode && <TotalLengthInput />}

                <div className='mt-6'>{editMode
                  ? (<LegacyFAInput />)
                  : (
                    <div className='text-sm font-medium text-base-content'>
                      {trimLegacyFA(legacyFA)}
                    </div>)}
                </div>

                {(createdAt != null || updatedAt != null) &&
                  <div className='mt-8  border-t border-b'>
                    <ArticleLastUpdate createdAt={createdAt} createdBy={createdBy} updatedAt={updatedAt} updatedBy={updatedBy} />
                  </div>}

                {!editMode &&
                  <div className='mt-8'>
                    <TickButton climbId={climbId} name={name} grade={yds} />
                  </div>}

              </div>

              <div className='pl-1'>
                <ImportFromMtnProj isButton={false} />
              </div>
            </div>

            <div className='area-climb-page-summary-right'>
              <div className='mb-3 flex justify-between items-center'>
                <h3>Description</h3>
              </div>
              <Editor
                reset={resetSignal}
                initialValue={cache.description}
                editable={editMode}
                name='description'
                placeholder={editMode ? 'Enter a description' : 'This climb is missing some beta. Turn on Edit mode and help us improve this page.'}
                rules={CLIMB_DESCRIPTION_FORM_VALIDATION_RULES}
              />

              {(cache.location?.trim() !== '' || editMode) &&
                  (
                    <>
                      <h3 className='mb-3 mt-6'>Location</h3>
                      <Editor
                        reset={resetSignal}
                        name='location'
                        initialValue={cache.location}
                        editable={editMode}
                        placeholder='How to find this climb'
                        rules={CLIMB_LOCATION_FORM_VALIDATION_RULES}
                      />

                    </>
                  )}

              {(cache.protection?.trim() !== '' || editMode) &&
                  (
                    <>
                      <h3 className='mb-3 mt-6'>Protection</h3>
                      <Editor
                        reset={resetSignal}
                        name='protection'
                        initialValue={cache.protection}
                        editable={editMode}
                        placeholder='Example: 16 quickdraws'
                        rules={CLIMB_PROTECTON_FORM_VALIDATION_RULES}
                      />
                    </>
                  )}

              <div className='mt-4 block lg:hidden'>
                {/* Mobile-only */}
                {FormAction}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export async function getStaticPaths (): Promise<any> {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<ClimbPageProps, { id: string }> = async ({ params }) => {
  if (params == null || params.id == null) {
    return {
      notFound: true
    }
  }

  const climb = await getClimbById(params.id)

  const sortedClimbsInArea = await fetchSortedClimbsInArea(climb.ancestors[climb.ancestors.length - 1])
  let leftClimb: ClimbType | null = null
  let rightClimb: ClimbType | null = null

  for (const [index, climb] of sortedClimbsInArea.entries()) {
    if (climb.id === params.id) {
      leftClimb = (sortedClimbsInArea[index - 1] != null) ? sortedClimbsInArea[index - 1] : null
      rightClimb = sortedClimbsInArea[index + 1] != null ? sortedClimbsInArea[index + 1] : null
    }
  }

  // Pass climb data to the page via props
  return {
    props: {
      key: climb.id,
      climb,
      leftClimb,
      rightClimb
    },
    revalidate: 30
  }
}

/**
 * Fetch and sort the climbs in the area from left to right
 */
const fetchSortedClimbsInArea = async (uuid: string): Promise<ClimbType[]> => {
  const query = gql`query SortedNearbyClimbsByAreaUUID($uuid: ID) {
    area(uuid: $uuid) {
      uuid,
      climbs {
        uuid,
        id,
        metadata {
          climbId,
          left_right_index
        }
      }
    }
  }`

  const rs = await graphqlClient.query<{ area: AreaType }>({
    query,
    variables: {
      uuid: uuid
    }
  })

  if (rs.data == null || rs.data.area == null) {
    return []
  }

  // Copy readonly array so we can sort
  const routes = [...rs.data.area.climbs]

  return routes.sort(
    (a, b) =>
      parseInt(a.metadata.left_right_index, 10) -
      parseInt(b.metadata.left_right_index, 10)
  )
}

const trimLegacyFA = (s: string): string => {
  if (s == null || s.trim() === '') return 'FA Unknown'
  if (s.startsWith('FA')) return s
  return 'FA ' + s
}
/**
 * Generate dynamic meta tags for page
 */
const PageMeta = ({ climb }: ClimbPageProps): JSX.Element => {
  const { pageImages, pageTitle, pageDescription } = useClimbSeo({ climb })
  return (
    <SeoTags
      title={pageTitle}
      description={pageDescription}
      images={pageImages}
    />
  )
}

export const BoulderingGradeChip: React.FC = () => {
  return (<div>foos</div>)
}

const Editor = dynamic(async () => await import('../../components/editor/InplaceEditor'), {
  ssr: false
})

const InplaceTextInput = dynamic(async () => await import('../../components/editor/InplaceTextInput'), {
  ssr: false
})
