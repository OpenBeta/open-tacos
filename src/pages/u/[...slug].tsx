import { NextPage, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { groupBy, Dictionary } from 'underscore'
import dynamic from 'next/dynamic'

import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import { getTagsByMediaId } from '../../js/graphql/api'
import { getUserImages } from '../../js/sirv/SirvClient'
import { IUserProfile, MediaType, HybridMediaTag } from '../../js/types'
import PublicProfile from '../../components/users/PublicProfile'
import { getUserProfileByNick } from '../../js/auth/ManagementClient'
import usePermissions from '../../js/hooks/auth/usePermissions'
import { useUserProfileSeo } from '../../js/hooks/seo'
import useMediaDataStore from '../../js/hooks/useMediaDS'
import type { UserGalleryProps } from '../../components/media/UserGallery'
import OnboardingChecklist from '../../components/ui/OnboardingChecklist'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

interface UserHomeProps {
  uid: string
  postId: string | null
  serverMediaList: MediaType[]
  serverTagMap: Dictionary<HybridMediaTag[]>
  userProfile: IUserProfile
}

const UserHomePage: NextPage<UserHomeProps> = ({ uid, postId = null, serverMediaList, serverTagMap, userProfile }) => {
  const router = useRouter()

  const auth = usePermissions({ ownerProfileOnPage: userProfile })

  const { isAuthorized } = auth

  const { mediaList, tagMap } = useMediaDataStore({ isAuthorized, uid, serverMediaList, serverTagMap })

  const { author, pageTitle, pageImages } = useUserProfileSeo({
    username: uid,
    fullName: userProfile?.name,
    imageList: serverMediaList
  })

  useEffect(() => {
    const showOnboardingToast = (): void => {
      const checklistItems = [
        {
          text: 'Add 3 photos to complete your profile',
          isCompleted: mediaList?.length >= 3
        },
        {
          text: 'Create a username',
          isCompleted: (uid !== null)
        }
      ]
      if (userProfile?.loginsCount !== undefined && userProfile.loginsCount < 3) {
        toast(<OnboardingChecklist checklistItems={checklistItems} />)
      }
    }

    showOnboardingToast()
  }, [uid, mediaList])

  const { isFallback } = router

  return (
    <>
      <SeoTags
        description='Share your climbing adventure photos and contribute to the Wiki.'
        title={pageTitle}
        images={pageImages}
        author={author}
      />

      <Layout
        contentContainerClass='content-default with-standard-y-margin'
        showFilterBar={false}
      >
        <div className='max-w-screen-2xl mx-auto flex flex-col items-center 2xl:px-8'>

          <PublicProfile userProfile={userProfile} />

          <hr className='mt-8' />

          <DynamicComponent
            auth={auth}
            uid={uid}
            postId={postId}
            userProfile={userProfile}
            initialImageList={mediaList}
            initialTagsByMediaId={tagMap}
          />

          {!isAuthorized && !isFallback && (
            <div className='mt-4 w-full mx-auto text-xs text-secondary text-center'>
              All photos are copyrighted by their respective owners.  All Rights Reserved.
            </div>
          )}
        </div>
      </Layout>
    </>

  )
}
export default UserHomePage

export async function getStaticPaths (): Promise<any> {
  // let paths: any = []
  // try {
  //   const users = await getAllUsersMetadata()
  //   paths = users.map(user => ({ params: { slug: [user.user_metadata.nick] } }))
  // } catch (e) {
  //   console.log('Warning: Error fetching user metadata from Auth provider.  User profile pages will not be pre-generated at build time.')
  // }
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<UserHomeProps, { slug: string[] }> = async ({ params }) => {
  const uid = params?.slug?.[0] ?? null
  const postId = params?.slug?.[1] ?? null

  if (uid == null) {
    return { notFound: true }
  }

  if (postId != null && params?.slug?.[2] !== 'gallery') {
    // No 'gallery' means the page is either linked from somewhere or opened directly in the browser.
    // In this case direct users to the single image view page/
    return {
      redirect: {
        permanent: false,
        destination: `/p/${uid}/${postId}`
      }
    }
  }

  try {
    const userProfile = await getUserProfileByNick(uid)

    if (userProfile?.uuid == null) {
      throw new Error('Bad user profile data')
    }

    const { uuid } = userProfile

    const { mediaList, mediaIdList } = await getUserImages(uuid, 100)

    let tagsByMediaId: Dictionary<HybridMediaTag[]> = {}

    const tagArray = await getTagsByMediaId(mediaIdList)
    tagsByMediaId = groupBy(tagArray, 'mediaUuid')

    const data = {
      uid,
      postId,
      serverMediaList: mediaList,
      serverTagMap: tagsByMediaId,
      userProfile
    }
    return {
      props: data,
      revalidate: 10
    }
  } catch (e) {
    console.log('Error in getStaticProps()', e)
    return {
      notFound: true
    }
  }
}

const DynamicComponent = dynamic<UserGalleryProps>(
  async () =>
    await import('../../components/media/UserGallery').then(
      module => module.default), { ssr: false }
)
