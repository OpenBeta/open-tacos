import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { v5 as uuidv5 } from 'uuid'
import { groupBy, Dictionary } from 'underscore'

import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import ImageTable from '../../components/users/ImageTable'
import { getTagsByMediaId } from '../../js/graphql/api'
// import { listPhotos } from '../../js/imgix/ImgixClient'
import { getUserImages } from '../../js/sirv/SirvClient'
import { MediaTag, MediaType } from '../../js/types'

interface UserHomeProps {
  uid: string
  mediaList: MediaType[]
  tagsByMediaId: Dictionary<MediaTag[]>
}
const UserHomePage: NextPage<UserHomeProps> = ({ uid, mediaList, tagsByMediaId }) => {
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
      >
        <div className='max-w-screen-2xl w-full mx-auto'>
          {router.isFallback && <div>Loading...</div>}
          {mediaList?.length === 0 && <div>Account not found</div>}
          {mediaList?.length > 0 && <ImageTable uid={uid} imageList={mediaList} initialTagsByMediaId={tagsByMediaId} />}
        </div>
      </Layout>
    </>

  )
}
export default UserHomePage

export async function getStaticPaths (): Promise<any> {
  return {
    paths: [{ params: { uid: 'vietnguyen' } }],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<UserHomeProps> = async ({ params }) => {
  const { uid } = params
  // const imageList = await listPhotos({ uid: uid as string })
  const { mediaList, mediaIdList } = await getUserImages(MOCK_USER_ID_MAP[uid as string])

  // const uuidList = imageList.map(imageInfo => uuidv5(imageInfo.origin_path, uuidv5.URL))

  const tagArray = await getTagsByMediaId(mediaIdList)
  const tagsByMediaId = groupBy(tagArray, 'mediaUuid')
  const data = {
    uid: uid as string,
    mediaList,
    tagsByMediaId
  }
  return {
    props: data
  }
}

const MOCK_USER_ID_MAP = {
  vietnguyen: 'abe96612-2742-43b0-a128-6b19d4e4615f'
}
