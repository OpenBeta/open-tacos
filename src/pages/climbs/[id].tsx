import React, { useState } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import { useForm, FormProvider } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import clx from 'classnames'

import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import { AreaType, Climb, MediaBaseTag } from '../../js/types'
import SeoTags from '../../components/SeoTags'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import RouteGradeChip from '../../components/ui/RouteGradeChip'
import RouteTypeChips from '../../components/ui/RouteTypeChips'
import PhotoMontage from '../../components/media/PhotoMontage'
import { enhanceMediaListWithUsernames } from '../../js/usernameUtil'
import { useClimbSeo } from '../../js/hooks/seo/useClimbSeo'
import { useHotkeys } from 'react-hotkeys-hook'
import { useSwipeable } from 'react-swipeable'
import FavouriteButton from '../../components/users/FavouriteButton'
import TickButton from '../../components/users/TickButton'
import { useCanary } from '../../js/hooks'
import { ImportFromMtnProj } from '../../components/users/ImportFromMtnProj'
import LockToggle from '../../components/ui/LockToggle'
import { MUTATION_UPDATE_CLIMBS, ChangesInput } from '../../js/graphql/gql/contribs'
// import InplaceTextInput from '../../components/editor/InplaceTextInput'
interface ClimbPageProps {
  climb: Climb
  mediaListWithUsernames: MediaBaseTag[]
  leftClimb: Climb | null
  rightClimb: Climb | null
}

const ClimbPage: NextPage<ClimbPageProps> = (props: ClimbPageProps) => {
  const router = useRouter()
  return (
    <>
      {!router.isFallback && <PageMeta {...props} />}
      <Layout
        showFilterBar={false}
        contentContainerClass='content-default with-standard-y-margin min-h-screen'
      >
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
  const [editMode, setEditMode] = useState(false)
  const [resetCount, setResetCount] = useState(0)
  const router = useRouter()
  const session = useSession()

  const { id, name, fa, yds, type, content, safety, metadata, ancestors, pathTokens } = climb
  const { climbId } = metadata
  const { description, location, protection } = content
  useState([leftClimb, rightClimb])
  const isCanary = useCanary()

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

  // Form declaration
  const form = useForm(
    {
      mode: 'onBlur',
      defaultValues: { name, description, protection, location }
    })

  const { handleSubmit, formState: { isSubmitting, isDirty }, reset } = form

  const submitHandler = async (formData): Promise<void> => {
    const { description, location, protection, name } = formData
    await updateClimbsApi({
      variables: {
        input: {
          parentId: ancestors[ancestors.length - 1],
          changes: [{ id, description, location, protection, name }]
        }
      },
      context: {
        headers: {
          authorization: `Bearer ${session?.data?.accessToken as string ?? ''}`
        }
      }
    })
  }

  const [updateClimbsApi] = useMutation<{ updateClimbsApi: string[] }, { input: ChangesInput }>(
    MUTATION_UPDATE_CLIMBS, {
      client: graphqlClient,
      onCompleted: (data) => {
        reset(undefined, { keepValues: true })
      }
    }
  )

  return (
    <div className='lg:flex lg:justify-center w-full' {...swipeHandlers}>
      <div className='px-4 max-w-screen-xl w-full'>
        <BreadCrumbs
          pathTokens={pathTokens}
          ancestors={ancestors}
          isClimbPage
        />
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className='py-6'>
              <PhotoMontage photoList={mediaListWithUsernames} />
            </div>
            <div className='lg:grid lg:grid-cols-3 w-full'>
              <div
                id='Title Information'
                className='lg:border-r-2 border-base-content'
              >

                <h1 className='text-4xl md:text-5xl mr-10'>
                  <InplaceTextInput
                    reset={resetCount}
                    name='name'
                    editable={editMode}
                    initialValue={name}
                    placeholder='Climb name'
                  />
                </h1>
                <div className='pl-1'>
                  <div
                    className='flex items-center space-x-2 mt-6'
                  >
                    <RouteGradeChip grade={yds} safety={safety} />
                    <RouteTypeChips type={type} />
                  </div>

                  <div
                    title='First Assent'
                    className='text-slate-700 mt-4 text-sm'
                  >
                    <strong>FA: </strong>{fa}
                  </div>

                  <div className='flex flex-col pt-8'>
                    <FavouriteButton climbId={climbId} />
                    {isCanary && <TickButton climbId={climbId} name={name} grade={yds} />}
                  </div>
                </div>

                <div className='pl-1'>
                  {isCanary && <ImportFromMtnProj isButton={false} />}
                </div>
              </div>

              <div className='mt-16 lg:mt-0 lg:col-span-2 lg:pl-16 mb-16 w-full'>
                <div className='flex justify-between'>
                  <h3 className='mb-3'>Description</h3>
                  <LockToggle name='Edit' onChange={setEditMode} />
                </div>
                <div><Editor
                  reset={resetCount}
                  initialValue={content.description}
                  editable={editMode}
                  name='description'
                  placeholder='Enter a description'
                     />
                </div>
                {content.location !== ''
                  ? (
                    <>
                      <h3 className='mb-3 mt-6'>Location</h3>
                      <div><Editor reset={resetCount} name='location' initialValue={content.location} editable={editMode} /></div>

                    </>
                    )
                  : ''}
                <h3 className='mb-3 mt-6'>Protection</h3>
                <div><Editor reset={resetCount} name='protection' initialValue={content.protection} editable={editMode} /></div>
                {editMode &&
                  <div className='mt-6 flex justify-end gap-4'>
                    <button
                      className={clx('btn btn-sm btn-link', isDirty ? '' : 'btn-disabled')} type='reset' onClick={() => {
                        reset({ description, location, protection })
                        setResetCount(Date.now())
                      }}
                    >Reset
                    </button>
                    <button type='submit' disabled={isSubmitting || !isDirty} className='btn btn-primary btn-solid btn-sm'>&nbsp;Save&nbsp;</button>
                  </div>}
              </div>

            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export async function getStaticPaths (): Promise<any> {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<ClimbPageProps, { id: string}> = async ({ params }) => {
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

  const rs = await graphqlClient.query<{climb: Climb}>({
    query,
    variables: {
      uuid: params.id
    }
  })

  if (rs.data == null || rs.data.climb == null) {
    return {
      notFound: true,
      revalidate: 10
    }
  }

  let mediaListWithUsernames = rs.data.climb.media
  try {
    mediaListWithUsernames = await enhanceMediaListWithUsernames(mediaListWithUsernames)
  } catch (e) {
    console.log('Error when trying to add username to image data', e)
  }

  const sortedClimbsInArea = await fetchSortedClimbsInArea(rs.data.climb.ancestors[rs.data.climb.ancestors.length - 1])
  let leftClimb
  let rightClimb

  for (const [index, climb] of sortedClimbsInArea.entries()) {
    if (climb.id === params.id) {
      leftClimb = (sortedClimbsInArea[index - 1] !== undefined) ? sortedClimbsInArea[index - 1] : null
      rightClimb = sortedClimbsInArea[index + 1] !== undefined ? sortedClimbsInArea[index + 1] : null
    }
  }

  // Pass climb data to the page via props
  return {
    props: {
      key: rs.data.climb.id,
      climb: rs.data.climb,
      mediaListWithUsernames,
      leftClimb,
      rightClimb
    },
    revalidate: 10
  }
}

/**
 * Fetch and sort the climbs in the area from left to right
 */
const fetchSortedClimbsInArea = async (uuid: string): Promise<Climb[]> => {
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

  const rs = await graphqlClient.query<{area: AreaType}>({
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
