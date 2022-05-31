import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { groupBy, Dictionary } from 'underscore'

import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import ImageTable from '../../components/users/ImageTable'
import { getTagsByMediaId } from '../../js/graphql/api'
import { getUserImages } from '../../js/sirv/SirvClient'
import { MediaTag, MediaType, IUserProfile } from '../../js/types'
import PublicProfile from '../../components/users/PublicProfile'
import { getUserProfileByNick, getAllUsersMetadata } from '../../js/auth/ManagementClient'

interface UserHomeProps {
  uid: string
  mediaList: MediaType[]
  tagsByMediaId: Dictionary<MediaTag[]>
  userProfile: IUserProfile
}
const UserHomePage: NextPage<UserHomeProps> = ({ uid, mediaList, tagsByMediaId, userProfile }) => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Climbing Route Catalog</title>
        <meta name='description' content='Open license climbing route catalog' />
        <link rel='icon' href='/favicon.ico' />
        <SeoTags
          keywords={['openbeta', 'rock climbing', 'climbing api']}
          description='Climbing route catalog'
          title={uid}
        />
      </Head>

      <Layout
        contentContainerClass='content-default with-standard-y-margin'
        showFilterBar={false}
      >
        <div className='max-w-screen-2xl w-full mx-auto'>
          {router.isFallback && <div>Loading...</div>}

          {userProfile != null && <PublicProfile userProfile={userProfile} />}

          {mediaList?.length === 0 && <div>Account not found</div>}
          {mediaList?.length > 0 && <ImageTable uid={uid} imageList={mediaList} initialTagsByMediaId={tagsByMediaId} />}
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
  const { uid } = params ?? { uid: null }

  if (uid == null) {
    return { notFound: true }
  }

  try {
    const userProfile = await getUserProfileByNick(uid)
    const { mediaList, mediaIdList } = await getUserImages(userProfile.uuid)
    const tagArray = await getTagsByMediaId(mediaIdList)

    const tagsByMediaId = groupBy(tagArray, 'mediaUuid')
    const data = {
      uid,
      mediaList,
      tagsByMediaId,
      userProfile
    }
    return {
      props: data,
      revalidate: 60
    }
  } catch (e) {
    return {
      notFound: true,
      revalidate: 60
    }
  }
}
