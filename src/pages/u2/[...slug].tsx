import { NextPage, GetStaticProps } from 'next'
import React from 'react'
import Link from 'next/link'
import { getUserProfileByNick } from '../../js/auth/ManagementClient'
import { getTicksByUser } from '../../js/graphql/api'
import { TickType } from '../../js/types'

interface TicksIndexPageProps {
  uid: string
  ticks: TickType[]
}

/**
 * Why create a separate /u2/<userid> ?
 * - The current `/u/<userid/<imageid>` page is a big of a mess due to the way Next handles nested route.
 * - We probably want to support multiple views of ticks in the future.
 * Ex: `/u/<userid>/ticks` or `/u/<userid>/ticks/progress` etc.
 * - Incrementally adopt nested layout https://nextjs.org/blog/layouts-rfc
 */
const Index: NextPage<TicksIndexPageProps> = ({ uid, ticks }) => {
  return (
    <section className='max-w-lg mx-auto w-full px-4 py-8'>
      <h1>{uid}</h1>
      <div>
        {ticks?.map(Tick)}
        {ticks?.length === 0 && <div>No ticks</div>}
      </div>
    </section>
  )
}

export default Index

const Tick = (tick: TickType): JSX.Element => {
  const { _id, name, climbId, dateClimbed } = tick
  return (
    <div className='grid grid-cols-2 gap-x-4' key={_id}>
      <div>
        <Link href={`/climbs/${climbId}`}>
          <a className='hover:underline'>{name}</a>
        </Link>
      </div>
      <div className='text-base-300'>{dateClimbed.toLocaleDateString()}</div>
    </div>
  )
}

export async function getStaticPaths (): Promise<any> {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<TicksIndexPageProps, {slug: string[]}> = async ({ params }) => {
  const uid = params?.slug?.[0] ?? null
  // const viewId = params?.slug?.[1] ?? 'ticks'

  if (uid == null) {
    return { notFound: true }
  }

  try {
    const userProfile = await getUserProfileByNick(uid)

    if (userProfile?.uuid == null) {
      throw new Error('Bad user profile data')
    }

    const { uuid } = userProfile
    const ticks = await getTicksByUser(uuid)
    return {
      props: { uid, ticks },
      revalidate: 10
    }
  } catch (e) {
    return { notFound: true }
  }
}
