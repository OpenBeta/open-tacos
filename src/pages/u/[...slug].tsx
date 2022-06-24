import { NextPage, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { groupBy, Dictionary } from 'underscore'
import dynamic from 'next/dynamic'

import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import { getTagsByMediaId } from '../../js/graphql/api'
import { getUserImages, getFileInfo } from '../../js/sirv/SirvClient'
import { MediaTagWithClimb, IUserProfile, MediaType } from '../../js/types'
import PublicProfile from '../../components/users/PublicProfile'
import { getUserProfileByNick, getAllUsersMetadata } from '../../js/auth/ManagementClient'
import usePermissions from '../../js/hooks/auth/usePermissions'
import { useUserProfileSeo } from '../../js/hooks/seo'
import useMediaDataStore from '../../js/hooks/useMediaDS'
import type { UserGalleryProps } from '../../components/media/UserGallery'
import type { UserSingleImageViewProps } from '../../components/media/UserSingleImageView'

interface UserHomeProps {
  uid: string
  postId: string | null
  serverMainMedia: MediaType | null
  serverMediaList: MediaType[]
  serverTagMap: Dictionary<MediaTagWithClimb[]>
  userProfile: IUserProfile
}

const UserHomePage: NextPage<UserHomeProps> = ({ uid, postId = null, serverMediaList, serverTagMap, userProfile, serverMainMedia }) => {
  const router = useRouter()
  const auth = usePermissions({ ownerProfileOnPage: userProfile })

  const { isAuthorized } = auth

  const { mediaList, tagMap } = useMediaDataStore({ isAuthorized, uid, serverMediaList, serverTagMap })

  const { author, pageTitle, pageImages } = useUserProfileSeo({
    username: uid,
    fullName: userProfile?.name,
    imageList: serverMediaList
  })

  const backBtnFlag = router.query?.backBtn ?? null

  const { isFallback } = router

  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window?.location?.search)

    console.log('#', urlParams)
  }
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
          {isFallback && <div className='h-screen'>Loading...</div>}
          {backBtnFlag == null && postId != null
            ? (<DynamicUserFeatureImageview
                uid={uid}
                auth={auth}
                featureMedia={serverMainMedia}
                featureTags={serverMainMedia?.mediaId != null ? tagMap?.[serverMainMedia.mediaId] : []}
                mostRecentList={mediaList?.slice(0, 6) ?? []}
                mostRecentTagMap={tagMap}
                userProfile={userProfile}
                loaded={!isFallback}
               />)
            : (
              <>
                {userProfile != null && <PublicProfile userProfile={userProfile} />}

                {isAuthorized && (
                  <div className='flex justify-center mt-8 text-secondary text-sm whitespace-normal px-4 lg:px-0'>
                    <div className='border rounded-md px-6 py-2 shadow'>
                      <ul className='list-disc'>
                        <li>Please upload 3 photos to complete your profile {mediaList?.length >= 3 && <span>&#10004;</span>}</li>
                        <li>Remember to upload only your own photos</li>
                        <li>Keep it <b>Safe For Work</b> and climbing-related</li>
                      </ul>
                    </div>
                  </div>)}

                <hr className='mt-8' />

                <DynamicComponent
                  loaded={!router.isFallback}
                  auth={auth}
                  uid={uid}
                  userProfile={userProfile}
                  initialImageList={mediaList}
                  initialTagsByMediaId={tagMap}
                />

              </>
              )}

          {!isAuthorized && !isFallback && (
            <div className='mt-4 w-full mx-auto text-sm text-secondary text-center'>
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
  let paths: any = []
  try {
    const users = await getAllUsersMetadata()
    paths = users.map(user => ({ params: { slug: [user.user_metadata.nick] } }))
  } catch (e) {
    console.log('Warning: Error fetching user metadata from Auth provider.  User profile pages will not be pre-generated at build time.')
  }
  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<UserHomeProps, {slug: string[]}> = async ({ params }) => {
  console.log('#params', params)
  const uid = params?.slug?.[0] ?? null
  const postId = params?.slug?.[1] ?? null

  if (uid == null) {
    return { notFound: true }
  }

  if (uid == null) {
    return { notFound: true }
  }

  try {
    const userProfile = await getUserProfileByNick(uid)

    if (userProfile?.uuid == null) {
      throw new Error('Bad user profile data')
    }

    const { uuid } = userProfile
    const filename = postId != null ? `/u/${uuid}/${postId}` : null

    let mainMedia: MediaType | null = null
    if (filename != null) {
      mainMedia = await getFileInfo(uuid, filename)
    }

    const { mediaList, mediaIdList } = await getUserImages(uuid, 100)

    let tagsByMediaId: Dictionary<MediaTagWithClimb[]> = {}

    if (mediaList.length > 0) {
      if (mainMedia?.mediaId != null) {
        mediaIdList.push(mainMedia?.mediaId)
      }
      const tagArray = await getTagsByMediaId(mediaIdList)
      tagsByMediaId = groupBy(tagArray, 'mediaUuid')
    }

    const data = {
      uid,
      postId,
      serverMainMedia: mainMedia,
      serverMediaList: mediaList,
      serverTagMap: tagsByMediaId,
      userProfile
    }
    return {
      props: data,
      revalidate: 120
    }
  } catch (e) {
    console.log('Error in getStaticProps()', e)
    return {
      notFound: true,
      revalidate: 120
    }
  }
}

const DynamicComponent = dynamic<UserGalleryProps>(
  async () =>
    await import('../../components/media/UserGallery').then(
      module => module.default), { ssr: false }
)

const DynamicUserFeatureImageview = dynamic<UserSingleImageViewProps>(
  async () =>
    await import('../../components/media/UserSingleImageView').then(
      module => module.default), { ssr: true }
)
