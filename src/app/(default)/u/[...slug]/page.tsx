import dynamic from 'next/dynamic'
import { notFound, redirect } from 'next/navigation'

import PublicProfile from '@/components/users/PublicProfile'
import type { UserGalleryProps } from '../../components/media/UserGallery'
import useUserProfileCmd from '@/js/hooks/useUserProfileCmd'
import { UserPublicPage } from '@/js/types/User'

async function getUserPublicPage (uid: string): Promise<UserPublicPage> {
  const { getUserPublicPage } = useUserProfileCmd({ accessToken: '' })
  return await getUserPublicPage(uid)
}

export async function generateStaticParams (): Promise<Array<{ slug: string[] }>> {
  const csvStr = process.env.PREBUILD_PROFILES
  if (csvStr == null || csvStr.trim() === '') return []

  return csvStr.split(',').map((username) => ({
    slug: [username.trim()]
  }))
}

export default async function UserHomePage ({ params }: { params: { slug: string[] } }): Promise<JSX.Element> {
  const uid = params.slug?.[0] ?? null
  const postId = params.slug?.[1] ?? null

  if (uid == null) {
    notFound()
  }

  if (postId != null && params.slug?.[2] !== 'gallery') {
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

  return (
    <>
      <div className='max-w-screen-2xl mx-auto flex flex-col items-center 2xl:px-8 py-4'>
        <PublicProfile userProfile={userPublicPage?.profile} />
        <DynamicComponent uid={uid} postId={postId} userPublicPage={userPublicPage} />
      </div>
    </>
  )
}

const DynamicComponent = dynamic<UserGalleryProps>(
  async () => await import('../../components/media/UserGallery').then((module) => module.default),
  { ssr: false }
)
