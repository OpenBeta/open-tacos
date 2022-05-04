import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import ImageTable from '../../components/users/ImageTable'
import { listPhotos } from '../../js/imgix/ImgixClient'

interface UserHomeProps {
  uid: string
  imageList: any[]
}
const UserHomePage: NextPage<UserHomeProps> = ({ uid, imageList }) => {
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
          {imageList?.length > 0 && <ImageTable imageList={imageList} />}
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
  const data = {
    uid: uid as string,
    imageList
  }
  return {
    props: data
  }
}
