import { NextPage, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { groupBy, Dictionary } from 'underscore'

import Layout from '../../../components/layout'
import SeoTags from '../../../components/SeoTags'
import UserGallery from '../../../components/media/UserGallery'
import { getTagsByMediaId } from '../../../js/graphql/api'
import { getUserImages } from '../../../js/sirv/SirvClient'
import { MediaTagWithClimb, IUserProfile, MediaType } from '../../../js/types'
import PublicProfile from '../../../components/users/PublicProfile'
import { getUserProfileByNick, getAllUsersMetadata } from '../../../js/auth/ManagementClient'
import usePermissions from '../../../js/hooks/auth/usePermissions'
import { useUserProfileSeo } from '../../../js/hooks/seo'
import useMediaDataStore from '../../../js/hooks/useMediaDS'
interface UserHomeProps {
  uid: string
  serverMediaList: MediaType[]
  serverTagMap: Dictionary<MediaTagWithClimb[]>
  userProfile: IUserProfile
}

const UserHomePage: NextPage<UserHomeProps> = ({ uid, serverMediaList, serverTagMap, userProfile }) => {
  const router = useRouter()
  const auth = usePermissions({ ownerProfileOnPage: userProfile })

  const { isAuthorized } = auth

  const { mediaList, tagMap } = useMediaDataStore({ isAuthorized, uid, serverMediaList, serverTagMap })

  const { author, pageTitle, pageImages } = useUserProfileSeo({
    username: uid,
    fullName: userProfile?.name,
    imageList: serverMediaList
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
        <div className='max-w-screen-2xl mx-auto '>

          {router.isFallback && <div>Loading...</div>}

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

          {mediaList?.length >= 0 &&
            <UserGallery
              auth={auth}
              uid={uid}
              userProfile={userProfile}
              initialImageList={mediaList}
              initialTagsByMediaId={tagMap}
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
    paths = users.map(user => ({ params: { uid: user.user_metadata.nick } }))
  } catch (e) {
    console.log('Warning: Error fetching user metadata from Auth provider.  User profile pages will not be pre-generated at build time.')
  }
  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<UserHomeProps, {uid: string}> = async ({ params }) => {
  const uid = params?.uid ?? null

  if (uid == null) {
    return { notFound: true }
  }

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
      serverMediaList: mediaList,
      serverTagMap: tagsByMediaId,
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
