import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import PublicProfile from '../../components/users/PublicProfile'
import { useUserProfileSeo } from '../../js/hooks/seo'
import type { UserGalleryProps } from '../../components/media/UserGallery'
import useUserProfileCmd from '../../js/hooks/useUserProfileCmd'
import { UserPublicPage } from '../../js/types/User'
import usePermissions from '../../js/hooks/auth/usePermissions'
import { relayMediaConnectionToMediaArray } from '../../js/utils'

interface UserHomeProps {
  uid: string
  postId: string | null
  userPublicPage: UserPublicPage
}

const UserHomePage: NextPage<UserHomeProps> = ({ uid, postId = null, userPublicPage }) => {
  const router = useRouter()

  const { isAuthorized } = usePermissions({ currentUserUuid: userPublicPage?.profile?.userUuid })

  const mediaList = relayMediaConnectionToMediaArray(userPublicPage?.media?.mediaConnection)

  const { author, pageTitle, pageImages } = useUserProfileSeo({
    username: uid,
    fullName: userPublicPage?.profile?.displayName,
    imageList: mediaList
  })

  const { isFallback } = router

  return (
    <>
      {!isFallback &&
        <SeoTags
          description='Share your climbing adventure photos and contribute to the Wiki.'
          title={pageTitle}
          images={pageImages}
          author={author}
        />}

      <Layout
        contentContainerClass='content-default with-standard-y-margin'
        showFilterBar={false}
      >
        {isFallback
          ? (<div>Loading ...</div>)
          : (
            <div className='max-w-screen-2xl mx-auto flex flex-col items-center 2xl:px-8'>

              <PublicProfile userProfile={userPublicPage?.profile} />

              {isAuthorized && (
                <div className='flex justify-center mt-8 text-secondary text-sm whitespace-normal px-4 lg:px-0'>
                  <div className='border rounded-md px-6 py-2 shadow'>
                    <ul className='list-disc'>
                      <li>Please upload 3 photos to complete your profile {mediaList?.length >= 3 && <span>&#10004;</span>}</li>
                      <li>Upload only your own photos</li>
                      <li>Keep it <b>Safe For Work</b> and climbing-related</li>
                    </ul>
                  </div>
                </div>)}

              <hr className='mt-8' />

              <DynamicComponent
                uid={uid}
                postId={postId}
                userPublicPage={userPublicPage}
              />

              {!isAuthorized && (
                <div className='mt-4 w-full mx-auto text-xs text-base-content text-center'>
                  All photos are copyrighted by their respective owners.  All Rights Reserved.
                </div>
              )}
            </div>)}
      </Layout>
    </>

  )
}
export default UserHomePage

export const getStaticPaths: GetStaticPaths = () => {
  let profiles: any
  const csvStr = process.env.PREBUILD_PROFILES
  if (csvStr != null && csvStr.trim().length > 2) {
    const userList = csvStr.split(',')
    profiles = userList.map(username => ({
      params: { slug: [username.trim()] }
    }))
  }

  return {
    paths: profiles ?? [],
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
    const { getUserPublicPage } = useUserProfileCmd({ accessToken: '' })
    const page = await getUserPublicPage(uid)

    console.log('## page data', page)
    const data = {
      uid,
      postId,
      userPublicPage: page
    }

    return {
      props: data,
      revalidate: 10
    }
  } catch (e) {
    if (/not found/i.test((e as Error).message)) {
      return { notFound: true }
    }
    throw e
  }
}

const DynamicComponent = dynamic<UserGalleryProps>(
  async () =>
    await import('../../components/media/UserGallery').then(
      module => module.default), { ssr: false }
)
