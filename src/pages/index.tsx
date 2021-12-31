import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Climbing Route Catalog</title>
        <meta name='description' content='Open license climbing route catalog' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <h1 className='text-2xl font-bold underline'>Welcome</h1>
      </main>

      <footer>
        <p>footer</p>
      </footer>
    </div>
  )
}

export default Home
