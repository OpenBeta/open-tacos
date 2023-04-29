import { NextPage, GetStaticProps } from 'next'
// import { useRouter } from 'next/router'
// import dynamic from 'next/dynamic'

// import Layout from '../../components/layout'
// import SeoTags from '../../components/SeoTags'
// import { getUserMedia } from '../../js/graphql/api'
// import { getUserImages, getFileInfo } from '../../js/sirv/SirvClient'
import { IUserProfile, MediaWithTags } from '../../js/types'
import { getUserProfileByNick } from '../../js/auth/ManagementClient'
// import usePermissions from '../../js/hooks/auth/usePermissions'
// import { useUserProfileSeo } from '../../js/hooks/seo'
// import type { UserSingleImageViewProps } from '../../components/media/UserSingleImageView'

interface UserSinglePostViewProps {
  uid: string
  postId: string | null
  serverMediaList: MediaWithTags[]
  userProfile: IUserProfile
}

const UserSinglePostView: NextPage<UserSinglePostViewProps> = ({ uid, postId = null, serverMediaList, userProfile }) => {
  // const router = useRouter()
  // const auth = usePermissions({ ownerProfileOnPage: userProfile })

  // const { isAuthorized } = auth

  // const { author, pageTitle, pageImages } = useUserProfileSeo({
  //   username: uid,
  //   fullName: userProfile?.name,
  //   imageList: serverMediaList
  // })

  // const { isFallback } = router

  return (
    <>
      {/* <SeoTags
        description='Share your climbing adventure photos and contribute to the Wiki.'
        title={pageTitle}
        images={serverMediaList?.filename != null ? [serverMainMedia.filename] : pageImages}
        author={author}
      /> */}
      {/*
      <Layout
        contentContainerClass='content-default with-standard-y-margin'
        showFilterBar={false}
      >
        <div className='max-w-screen-2xl mx-auto flex flex-col items-center 2xl:px-8'>
          <DynamicUserFeatureImageview
            uid={uid}
            auth={auth}
            featureMedia={serverMainMedia}
            featureTags={serverMainMedia?.mediaId != null ? tagMap?.[serverMainMedia.mediaId] : []}
            mostRecentList={mediaList?.slice(0, 6) ?? []}
            mostRecentTagMap={tagMap}
            userProfile={userProfile}
            loaded={!isFallback}
          />
          {!isAuthorized && !isFallback && (
            <div className='mt-4 w-full mx-auto text-sm text-secondary text-center'>
              All photos are copyrighted by their respective owners.  All Rights Reserved.
            </div>
          )}
        </div>
      </Layout> */}
    </>

  )
}
export default UserSinglePostView

export async function getStaticPaths (): Promise<any> {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<UserSinglePostViewProps, {slug: string[]}> = async ({ params }) => {
  const uid = params?.slug?.[0] ?? null
  // const postId = params?.slug?.[1] ?? null

  if (uid == null) {
    return { notFound: true }
  }

  try {
    const userProfile = await getUserProfileByNick(uid)

    if (userProfile?.uuid == null) {
      throw new Error('Bad user profile data')
    }

    // const { uuid } = userProfile
    // const filename = postId != null ? `/u/${uuid}/${postId}` : null

    // const list = await getUserMedia(uuid, 4)

    // const data = {
    //   uid,
    //   postId,
    //   serverMediaList: [],
    //   userProfile
    // }
    return {
      notFound: true // Just direct to a 404.  I'll fix this in another PR.
      // props: data,
      // revalidate: 120
    }
  } catch (e) {
    console.log('Error in getStaticProps()', e)
    return {
      notFound: true,
      revalidate: 120
    }
  }
}

// const DynamicUserFeatureImageview = dynamic<UserSingleImageViewProps>(
//   async () =>
//     await import('../../components/media/UserSingleImageView').then(
//       module => module.default), { ssr: true }
// )
