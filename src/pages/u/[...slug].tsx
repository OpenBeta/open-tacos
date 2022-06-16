import { useEffect } from 'react'
import { NextPage, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { groupBy, Dictionary } from 'underscore'

import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import ImageTable from '../../components/media/ImageTable'
import { getTagsByMediaId } from '../../js/graphql/api'
import { getUserImages } from '../../js/sirv/SirvClient'
import { MediaTagWithClimb, IUserProfile, MediaType } from '../../js/types'
import PublicProfile from '../../components/users/PublicProfile'
import { getUserProfileByNick, getAllUsersMetadata } from '../../js/auth/ManagementClient'
import usePermissions from '../../js/hooks/auth/usePermissions'
import { userMediaStore } from '../../js/stores/media'
import { useUserProfileSeo } from '../../js/hooks/seo'

interface UserHomeProps {
  uid: string
  postId: string | null
  mediaList: MediaType[]
  tagsByMediaId: Dictionary<MediaTagWithClimb[]>
  userProfile: IUserProfile
}

const UserHomePage: NextPage<UserHomeProps> = ({ uid, postId = null, mediaList: serverSideList, tagsByMediaId, userProfile }) => {
  const router = useRouter()
  const auth = usePermissions({ ownerProfileOnPage: userProfile })

  const { isAuthorized } = auth
  useEffect(() => {
    if (isAuthorized) {
      // Load server side image data into local state for client-side add/remove
      userMediaStore.set.imageList(serverSideList)
    }
  }, [isAuthorized])

  const clientSideList = userMediaStore.use.imageList()
  const currentMediaList = isAuthorized ? clientSideList : serverSideList

  const { author, pageTitle, pageImages } = useUserProfileSeo({
    username: uid,
    fullName: userProfile?.name,
    imageList: serverSideList
  })

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
        <div className='max-w-screen-2xl w-full mx-auto'>
          {router.isFallback && <div>Loading...</div>}

          {userProfile != null && <PublicProfile userProfile={userProfile} />}

          {isAuthorized && (
            <div className='flex justify-center mt-8 text-secondary text-sm'>
              <ul className='list-disc'>
                {currentMediaList?.length < 3 &&
                  <li>Please upload 3 photos to complete your profile</li>}
                <li>Only upload your own photos</li>
                <li>Keep it <b>Safe For Work</b> and climbing-related</li>
              </ul>
            </div>)}

          <hr className='my-8' />

          {currentMediaList?.length >= 0 &&
            <ImageTable
              auth={auth}
              uid={uid}
              userProfile={userProfile}
              initialImageList={currentMediaList}
              initialTagsByMediaId={tagsByMediaId}
            />}
          <hr className='my-8' />

          {!isAuthorized && <div className='mx-auto text-sm text-secondary text-center'>All photos are copyrighted by their respective owners.  All Rights Reserved.</div>}
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

  if (uid == null) {
    return { notFound: true }
  }

  const postId = params?.slug?.[1] ?? null

  try {
    const userProfile = await getUserProfileByNick(uid)
    const { mediaList, mediaIdList } = await getUserImages(userProfile.uuid)
    let tagsByMediaId: Dictionary<MediaTagWithClimb[]> = {}
    if (mediaList.length > 0) {
      const tagArray = await getTagsByMediaId(mediaIdList)
      tagsByMediaId = groupBy(tagArray, 'mediaUuid')
    }

    const data = {
      uid,
      postId,
      mediaList,
      tagsByMediaId,
      userProfile
    }
    return {
      props: data,
      revalidate: 60
    }
  } catch (e) {
    console.log('Error in getStaticProps()', e)
    return {
      notFound: true,
      revalidate: 60
    }
  }
}
