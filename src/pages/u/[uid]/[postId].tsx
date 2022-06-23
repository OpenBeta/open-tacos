import { NextPage, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import classNames from 'classnames'

import Layout from '../../../components/layout'
import SeoTags from '../../../components/SeoTags'
import { getTagsByMediaId } from '../../../js/graphql/api'
import { getFileInfo, getUserImages } from '../../../js/sirv/SirvClient'
import { MediaTagWithClimb, IUserProfile, MediaType } from '../../../js/types'
import { TinyProfile } from '../../../components/users/PublicProfile'
import { getUserProfileByNick } from '../../../js/auth/ManagementClient'
import usePermissions from '../../../js/hooks/auth/usePermissions'
import { useUserProfileSeo } from '../../../js/hooks/seo'
import { SingleViewer } from '../../../components/media/slideshow/SlideViewer'
import useMediaDataStore from '../../../js/hooks/useMediaDS'
import MoreFromThisUser from '../../../components/media/MoreFromThisUser'

interface UserHomeProps {
  uid: string
  postId: string | null
  media: MediaType
  otherMediaList: MediaType[]
  tagList: MediaTagWithClimb[]
  userProfile: IUserProfile
}

const SingleMediaPage: NextPage<UserHomeProps> = ({ uid, postId = null, media, tagList, otherMediaList, userProfile }) => {
  const router = useRouter()

  const mediaId = media?.mediaId ?? null
  const tags = mediaId == null ? {} : { [media.mediaId]: tagList }

  const auth = usePermissions({ ownerProfileOnPage: userProfile })
  const { isAuthorized } = auth
  const { mediaList, singleTagList } = useMediaDataStore({
    isAuthorized,
    uid,
    serverMediaList: [media],
    serverTagMap: tags
  })
  const { isFallback } = router

  // const currentMedia = media
  const currentTagList = singleTagList

  return (
    <>
      {!isFallback && <PageMeta uid={uid} media={media} userProfile={userProfile} />}
      <Layout
        contentContainerClass={classNames('content-default with-standard-y-margin')}
        showFilterBar={false}
      >
        <div className='max-w-screen-2xl flex flex-col items-center w-full h-full mx-auto'>
          <div className='max-w-screen-xl flex flex-col lg:flex-row items-stretch justify-center border rounded-md overflow-hidden drop-shadow-sm'>
            <SingleViewer
              loaded={!isFallback}
              media={mediaList[0]}
              tagList={currentTagList}
              userinfo={<TinyProfile userProfile={userProfile} />}
              auth={auth}
            />
          </div>
          <MoreFromThisUser loaded={!isFallback} uid={uid} mediaList={otherMediaList} />
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
  const uid = params?.uid ?? null
  const postId = params?.postId ?? null

  if (uid == null || postId == null) {
    return { notFound: true }
  }

  try {
    const userProfile = await getUserProfileByNick(uid)

    const { uuid } = userProfile
    const filename = `/u/${uuid}/${postId}`

    const media = await getFileInfo(uuid, filename) // Todo: combine get main image and most recent in 1 call
    const { mediaList: otherMediaList } = await getUserImages(uuid, 6) // Get most recent

    const tagList = await getTagsByMediaId([media.mediaId]) // For now only get tags for the main image

    const data = {
      uid,
      postId,
      media,
      tagList,
      otherMediaList,
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
