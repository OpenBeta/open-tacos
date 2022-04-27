import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import type { ListFileResponse } from 'imagekit/libs/interfaces'

import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import ImageTable from '../../components/users/ImageTable'
import { listFile } from '../../js/imagekit'

interface UserHomeProps {
  uid: string
  imageList: ListFileResponse[]
}
const UserHomePage: NextPage<UserHomeProps> = ({ uid, imageList }) => {
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
          <ImageTable imageList={imageList} />
        </div>
      </Layout>
    </>

  )
}
export default UserHomePage

export async function getStaticPaths (): Promise<any> {
  return {
    paths: [],
    fallback: true
  }
}
export const getStaticProps: GetStaticProps<UserHomeProps> = async ({ params }) => {
  const { uid } = params
  const imageList = await listFile()
  const data = {
    uid: uid as string,
    imageList
  }
  return {
    props: data
  }
}
