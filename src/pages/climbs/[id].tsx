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

import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import { AreaType, ClimbType, MediaBaseTag, RulesType, MediaType } from '../../js/types'
import SeoTags from '../../components/SeoTags'
import RouteGradeChip from '../../components/ui/RouteGradeChip'
import RouteTypeChips from '../../components/ui/RouteTypeChips'
import PhotoMontage from '../../components/media/PhotoMontage'
import { enhanceMediaListWithUsernames } from '../../js/usernameUtil'
import { useClimbSeo } from '../../js/hooks/seo/useClimbSeo'
import TickButton from '../../components/users/TickButton'
import { ImportFromMtnProj } from '../../components/users/ImportFromMtnProj'
import EditModeToggle from '../../components/editor/EditModeToggle'
import { FormSaveAction } from '../../components/editor/FormSaveAction'
import { AREA_NAME_FORM_VALIDATION_RULES } from '../../components/edit/EditAreaForm'
import { getImagesByFilenames } from '../../js/sirv/SirvClient'
import { indexBy } from 'underscore'
import useUpdateClimbsCmd from '../../js/hooks/useUpdateClimbsCmd'
import { StickyHeader } from '../../components/crag/StickyHeader'

export const CLIMB_DESCRIPTION_FORM_VALIDATION_RULES: RulesType = {
  maxLength: {
    value: 3500,
    message: 'Maxium 3500 characters.'
  }
}

export const CLIMB_LOCATION_FORM_VALIDATION_RULES: RulesType = {
  maxLength: {
    value: 800,
    message: 'Maxium 800 characters.'
  }
}

interface ClimbPageProps {
  climb: ClimbType
  mediaListWithUsernames: MediaBaseTag[]
  leftClimb: ClimbType | null
  rightClimb: ClimbType | null
}

const ClimbPage: NextPage<ClimbPageProps> = (props: ClimbPageProps) => {
  const router = useRouter()
  return (
    <>
      {!router.isFallback && <PageMeta {...props} />}
      <Layout
        showFilterBar={false}
        contentContainerClass='content-default'
      >
        {/* with-standard-y-margin min-h-screen */}
        {router.isFallback
          ? (
            <div className='px-4 max-w-screen-md'>
              <div>Loading...</div>
            </div>
            )
          : <Body {...props} />}
      </Layout>
    </>

  )
}

export default ClimbPage

const Body = ({ climb, mediaListWithUsernames, leftClimb, rightClimb }: ClimbPageProps): JSX.Element => {
  const { id, name, fa, yds, type, content, safety, metadata, ancestors, pathTokens } = climb
  const { climbId } = metadata

  const [editTogglePlaceholderRef, setEditTogglePlaceholderRef] = useState<HTMLElement|null>()

  const [editMode, setEditMode] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)
  const [cache, setCache] = useState({ name, ...content })

  const router = useRouter()
  const session = useSession()

  useEffect(() => {
    setCache({ name, ...content })
  }, [name, content])

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
    accessToken: session?.data?.accessToken as string
  })

  // React hook form declaration
  const form = useForm({
    mode: 'onBlur',
    defaultValues: { ...cache }
  })

  const { handleSubmit, reset } = form

  const submitHandler = async (formData): Promise<void> => {
    const { description, location, protection, name } = formData
    const input = {
      parentId: ancestors[ancestors.length - 1],
      changes: [{ id, description, location, protection, name }]
    }
    await updateClimbCmd(input)
    setCache({ ...formData })
    reset(formData, { keepValues: true })
  }

  return (
    <div className='px-4 py-4 lg:py-8 max-w-screen-xl mx-auto w-full' {...swipeHandlers}>
      <Portal.Root container={editTogglePlaceholderRef}>
        <EditModeToggle onChange={setEditMode} />
      </Portal.Root>

      <PhotoMontage photoList={mediaListWithUsernames} />

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)} className='mt-6 first:mt-0'>

          <StickyHeader
            isClimbPage
            ancestors={ancestors}
            pathTokens={pathTokens}
            cache={cache}
            editMode={editMode}
            onReset={() => setResetSignal(Date.now())}
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
              <div className='pl-1'>
                <div className='flex items-center space-x-2 mt-6'>
                  <RouteGradeChip grade={yds} safety={safety} />
                  <RouteTypeChips type={type} />
                </div>

                <div
                  title='First Assent'
                  className='text-slate-700 mt-4 text-sm'
                >
                  <strong>FA: </strong>{fa}
                </div>

                <div className='pt-8'>
                  <TickButton climbId={climbId} name={name} grade={yds} />
                </div>
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
                placeholder='Enter a description'
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
                        rules={CLIMB_LOCATION_FORM_VALIDATION_RULES}
                      />
                    </>
                  )}

              <div className='mt-4 block lg:hidden'>
                {/* Mobile-only */}
                <FormSaveAction
                  cache={cache}
                  editMode={editMode}
                  onReset={() => setResetSignal(Date.now())}
                />
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
  const query = gql`query ClimbByUUID($uuid: ID) {
    climb(uuid: $uuid) {
      id
      uuid
      name
      fa
      yds
      safety
      type {
        sport
        bouldering
        alpine
        tr
        trad
        mixed
        aid
      }
      media {
        mediaUrl
        mediaUuid
        destination
        destType
      }
      content {
        description
        location
        protection
      }
      pathTokens
      ancestors
      metadata {
        climbId
      }
    }
  }`

  const rs = await graphqlClient.query<{climb: ClimbType}>({
    query,
    variables: {
      uuid: params.id
    },
    fetchPolicy: 'no-cache'
  })

  if (rs.data == null || rs.data.climb == null) {
    return {
      notFound: true,
      revalidate: 30
    }
  }

  let mediaListWithUsernames: MediaBaseTag[] = rs.data.climb.media
  try {
    mediaListWithUsernames = await enhanceMediaListWithUsernames(mediaListWithUsernames)
  } catch (e) {
    console.log('Error when trying to add username to image data', e)
  }

  const sortedClimbsInArea = await fetchSortedClimbsInArea(rs.data.climb.ancestors[rs.data.climb.ancestors.length - 1])
  let leftClimb: ClimbType | null = null
  let rightClimb: ClimbType | null = null

  for (const [index, climb] of sortedClimbsInArea.entries()) {
    if (climb.id === params.id) {
      leftClimb = (sortedClimbsInArea[index - 1] != null) ? sortedClimbsInArea[index - 1] : null
      rightClimb = sortedClimbsInArea[index + 1] != null ? sortedClimbsInArea[index + 1] : null
    }
  }

  /**
   * Call Sirv API to get image metadata.  We should probably store metadata in the db.
   */
  const mediaListWithMetadata = await getImagesByFilenames(mediaListWithUsernames.map(entry => entry.mediaUrl))

  const mediaMetaDict = indexBy<MediaType[]>(mediaListWithMetadata.mediaList, 'mediaId')

  // Pass climb data to the page via props
  return {
    props: {
      key: rs.data.climb.id,
      climb: rs.data.climb,
      mediaListWithUsernames: mediaListWithUsernames.map(entry => ({ ...entry, mediaInfo: mediaMetaDict?.[entry.mediaUuid] ?? null })),
      leftClimb,
      rightClimb
    },
    revalidate: 10
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

/**
 * Generate dynamic meta tags for page
 */
const PageMeta = ({ climb, mediaListWithUsernames }: ClimbPageProps): JSX.Element => {
  const { pageImages, pageTitle, pageDescription } = useClimbSeo({ climb, imageList: mediaListWithUsernames })
  return (
    <SeoTags
      title={pageTitle}
      description={pageDescription}
      images={pageImages}
    />
  )
}

const Editor = dynamic(async () => await import('../../components/editor/InplaceEditor'), {
  ssr: false
})

const InplaceTextInput = dynamic(async () => await import('../../components/editor/InplaceTextInput'), {
  ssr: false
})
