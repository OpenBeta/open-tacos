import dynamic from 'next/dynamic'
import { notFound, redirect } from 'next/navigation'

import SeoTags from '@/components/SeoTags'
import PublicProfile from '@/components/users/PublicProfile'
import { useUserProfileSeo } from '@/js/hooks/seo'
import type { UserGalleryProps } from '../../components/media/UserGallery'
import useUserProfileCmd from '@/js/hooks/useUserProfileCmd'
import { UserPublicPage } from '@/js/types/User'
import usePermissions from '@/js/hooks/auth/usePermissions'
import { relayMediaConnectionToMediaArray } from '@/js/utils'

async function getUserPublicPage (uid: string) {
  const { getUserPublicPage } = useUserProfileCmd({ accessToken: '' })
  return await getUserPublicPage(uid)
}

export async function generateStaticParams () {
  const csvStr = process.env.PREBUILD_PROFILES
  if (!csvStr) return []

  return csvStr.split(',').map((username) => ({
    slug: [username.trim()]
  }))
}

export default async function UserHomePage ({ params }: { params: { slug: string[] } }): Promise<JSX.Element> {
  const uid = params.slug?.[0] ?? null
  const postId = params.slug?.[1] ?? null

  if (!uid) {
    notFound()
  }

  if (postId && params.slug?.[2] !== 'gallery') {
    redirect(`/p/${uid}/${postId}`)
  }

  let userPublicPage: UserPublicPage
  try {
    userPublicPage = await getUserPublicPage(uid)
  } catch (e) {
    if (/not found/i.test((e as Error).message)) {
      notFound()
    }
    throw e
  }

  const isAuthorized = true
  // const { isAuthorized } = usePermissions({ currentUserUuid: userPublicPage?.profile?.userUuid })
  const mediaList = relayMediaConnectionToMediaArray(userPublicPage?.media?.mediaConnection)

  const { author, pageTitle, pageImages } = useUserProfileSeo({
    username: uid,
    fullName: userPublicPage?.profile?.displayName,
    imageList: mediaList
  })

  return (
    <>
      {/* <SeoTags
        description='Share your climbing adventure photos and contribute to the Wiki.'
        title={pageTitle}
        images={pageImages}
        author={author}
      /> */}

      <div className='max-w-screen-2xl mx-auto flex flex-col items-center 2xl:px-8'>
        {/* <PublicProfile userProfile={userPublicPage?.profile} /> */}

        {isAuthorized && (
          <div className='flex justify-center mt-8 text-secondary text-sm whitespace-normal px-4 lg:px-0'>
            <div className='border rounded-md px-6 py-2 shadow'>
              <ul className='list-disc'>
                <li>
                  Please upload 3 photos to complete your profile{' '}
                  {mediaList?.length >= 3 && <span>&#10004;</span>}
                </li>
                <li>Upload only your own photos</li>
                <li>
                  Keep it <b>Safe For Work</b> and climbing-related
                </li>
              </ul>
            </div>
          </div>
        )}

        <hr className='mt-8' />

        <DynamicComponent uid={uid} postId={postId} userPublicPage={userPublicPage} />

        {!isAuthorized && (
          <div className='mt-4 w-full mx-auto text-xs text-base-content text-center'>
            All photos are copyrighted by their respective owners. All Rights Reserved.
          </div>
        )}
      </div>
    </>
  )
}

const DynamicComponent = dynamic<UserGalleryProps>(
  async () => await import('../../components/media/UserGallery').then((module) => module.default),
  { ssr: false }
)
