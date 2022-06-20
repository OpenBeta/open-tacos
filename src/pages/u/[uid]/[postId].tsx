import { NextPage, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import classNames from 'classnames'

import Layout from '../../../components/layout'
import SeoTags from '../../../components/SeoTags'
// import UserGallery from '../../../components/media/UserGallery'
import { getTagsByMediaId } from '../../../js/graphql/api'
import { getFileInfo } from '../../../js/sirv/SirvClient'
import { MediaTagWithClimb, IUserProfile, MediaType } from '../../../js/types'
import { TinyProfile } from '../../../components/users/PublicProfile'
import { getUserProfileByNick } from '../../../js/auth/ManagementClient'
import usePermissions from '../../../js/hooks/auth/usePermissions'
import { useUserProfileSeo } from '../../../js/hooks/seo'
import { SingleViewer } from '../../../components/media/slideshow/SlideViewer'

interface UserHomeProps {
  uid: string
  postId: string | null
  media: MediaType
  tagList: MediaTagWithClimb[]
  userProfile: IUserProfile
}

const SingleMediaPage: NextPage<UserHomeProps> = ({ uid, postId = null, media, tagList, userProfile }) => {
  const router = useRouter()

  const auth = usePermissions({ ownerProfileOnPage: userProfile })

  const { isFallback } = router

  return (
    <>
      {!isFallback && <PageMeta uid={uid} media={media} userProfile={userProfile} />}
      <Layout
        contentContainerClass={classNames('content-default with-standard-y-margin', isFallback ? 'h-screen-80' : '')}
        showFilterBar={false}
      >
        <div className='max-w-screen-2xl flex flex-col justify-center items-center w-full h-full mx-auto'>
          {router.isFallback
            ? <div>Loading...</div> // Todo: Add placeholder components
            : (
              <div className='max-w-screen-xl flex flex-col lg:flex-row items-stretch justify-center border rounded-md overflow-hidden drop-shadow-sm'>
                <SingleViewer
                  media={media}
                  tagList={tagList}
                  userinfo={<TinyProfile userProfile={userProfile} />}
                  auth={auth}
                />
              </div>)}
          <hr className='mt-16' />

        </div>
      </Layout>
    </>

  )
}
export default SingleMediaPage

export async function getStaticPaths (): Promise<any> {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<UserHomeProps, {uid: string, postId: string}> = async ({ params }) => {
  console.log('#PostView page params', params)
  const uid = params?.uid ?? null
  const postId = params?.postId ?? null

  if (uid == null || postId == null) {
    return { notFound: true }
  }

  try {
    const userProfile = await getUserProfileByNick(uid)

    const filename = `/u/${userProfile.uuid}/${postId}`
    const media = await getFileInfo(userProfile.uuid, filename)

    const tagList = await getTagsByMediaId([media.mediaId])

    const data = {
      uid,
      postId,
      media,
      tagList,
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

/**
 * Generate dynamic meta tags for page
 */
export const PageMeta = ({ uid, userProfile, media }: Pick<UserHomeProps, 'uid' | 'userProfile' | 'media'>): JSX.Element => {
  const { author, pageTitle, pageImages } = useUserProfileSeo({
    username: uid,
    fullName: userProfile?.name,
    imageList: [media]
  })
  return (
    <SeoTags
      description='Share your climbing adventure photos and contribute to the Wiki.'
      title={pageTitle}
      images={pageImages}
      author={author}
    />
  )
}
