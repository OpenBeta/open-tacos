import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { v5 as uuidv5 } from 'uuid'
import { groupBy, Dictionary } from 'underscore'

import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import ImageTable from '../../components/users/ImageTable'
import { getTagsByMediaId } from '../../js/graphql/api'
import { listPhotos } from '../../js/imgix/ImgixClient'
import { MediaTag } from '../../js/types'

interface UserHomeProps {
  uid: string
  imageList: any[]
  tagsByMediaId: Dictionary<MediaTag[]>
}
const UserHomePage: NextPage<UserHomeProps> = ({ uid, imageList, tagsByMediaId }) => {
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
          title='Home'
        />
      </Head>

      <Layout
        contentContainerClass='content-default with-standard-y-margin'
      >
        <div className='max-w-screen-2xl w-full mx-auto'>
          {router.isFallback && <div>Loading...</div>}
          {imageList?.length === 0 && <div>Account not found</div>}
          {imageList?.length > 0 && <ImageTable imageList={imageList} tagsByMediaId={tagsByMediaId} />}
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
  const imageList = await listPhotos({ uid: uid as string })
  const uuidList = imageList.map(imageInfo => uuidv5(imageInfo.origin_path, uuidv5.URL))

  const tagArray = await getTagsByMediaId(uuidList)
  const tagsByMediaId = groupBy(tagArray, 'mediaUuid')
  const data = {
    uid: uid as string,
    imageList,
    tagsByMediaId
  }
  return {
    props: data
  }
}
