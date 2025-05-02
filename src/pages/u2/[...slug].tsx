import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { NextPage, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getTicksByUser } from '../../js/graphql/api'
import { TickType } from '../../js/types'
import ImportFromMtnProj from '../../components/users/ImportFromMtnProj'
import Layout from '../../components/layout'
import { ChartsSectionProps } from '../../components/logbook/ChartsSection'

interface TicksIndexPageProps {
  username: string
  ticks: TickType[]
}

const INITIAL_COUNT = 20

/**
 * Why create a separate /u2/<userid> ?
 * - The current `/u/<userid/<imageid>` page is a big of a mess due to the way Next handles nested route.
 * - We probably want to support multiple views of ticks in the future.
 * Ex: `/u/<userid>/ticks` or `/u/<userid>/ticks/progress` etc.
 * - Incrementally adopt nested layout https://nextjs.org/blog/layouts-rfc
 */
const Index: NextPage<TicksIndexPageProps> = ({ username, ticks }) => {
  const { isFallback } = useRouter()
  const [showAll, setShowAll] = useState(false)

  return (
    <Layout
      contentContainerClass='content-default with-standard-y-margin'
      showFilterBar={false}
    >
      {isFallback
        ? <div className='h-screen'>Loading...</div>
        : (
          <>
            {ticks?.length !== 0 && <ChartsSection tickList={ticks} />}

            <section className='mx-16 py-4'>
              <h2>{username}</h2>
              <div className='py-4 flex items-center gap-6'>
                <ImportFromMtnProj username={username} />
                <a className='btn btn-xs md:btn-sm btn-outline' href={`/u/${username}`}>Classic Profile</a>
              </div>

              <h3 className='py-4'>Log book</h3>
              {ticks?.length > 0
                ? (
                  <div className='overflow-x-auto'>
                    <table className='w-full border-collapse border border-gray-300'>
                      <thead>
                        <tr className='bg-gray-100'>
                          <th className='border p-2 text-left'>Climb</th>
                          <th className='border p-2 text-left hidden sm:table-cell'>Grade</th>
                          <th className='border p-2 text-left hidden sm:table-cell'>Date Climbed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortTicks(ticks, showAll).map((tick) => (
                          <Tick key={tick._id} {...tick} />
                        ))}
                      </tbody>
                    </table>

                    {INITIAL_COUNT < ticks.length && (
                      <div className='flex justify-center mt-4'>
                        <button className='btn btn-primary' onClick={() => setShowAll(!showAll)}>
                          {showAll ? 'Show Less' : 'Show All'}
                        </button>
                      </div>
                    )}
                  </div>
                  )
                : (
                  <div>No ticks</div>
                  )}
            </section>
          </>)}
    </Layout>
  )
}

export default Index

const sortTicks = (ticks: TickType[], showAll: boolean): TickType[] => {
  const sortedTicks = [...ticks].sort((a, b) => b.dateClimbed - a.dateClimbed)
  return showAll ? sortedTicks : sortedTicks.slice(0, INITIAL_COUNT)
}

const Tick = (tick: TickType): JSX.Element => {
  const { _id, name, climbId, dateClimbed, grade } = tick
  return (
    <tr key={_id} className='border-b even:bg-gray-50 sm:table-row block w-full sm:w-auto'>

      {/* Desktop View */}
      <td className='border p-2 hidden sm:table-cell'>
        <Link href={`/climb/${climbId}`} className='hover:underline'>
          {name}
        </Link>
      </td>
      <td className='border p-2 hidden sm:table-cell'>{grade}</td>
      <td className='border p-2 text-gray-500 hidden sm:table-cell'>
        {new Date(dateClimbed).toLocaleDateString()}
      </td>

      {/* Mobile View */}
      <td className='p-2 sm:hidden block w-full border'>
        <div className='flex flex-col gap-1'>
          <Link href={`/climb/${climbId}`} className='hover:underline font-semibold'>
            {name}
          </Link>
          <span className='text-sm text-gray-600'>Grade: {grade}</span>
          <span className='text-sm text-gray-500'>Date: {new Date(dateClimbed).toLocaleDateString()}</span>
        </div>
      </td>

    </tr>
  )
}

export async function getStaticPaths (): Promise<any> {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<TicksIndexPageProps, { slug: string[] }> = async ({ params }) => {
  const username = params?.slug?.[0] ?? null

  if (username == null) {
    return { notFound: true }
  }

  try {
    const ticks = await getTicksByUser({ username })
    return {
      props: { username, ticks },
      revalidate: 10
    }
  } catch (e) {
    return { notFound: true }
  }
}

const ChartsSection = dynamic<ChartsSectionProps>(
  async () =>
    await import('../../components/logbook/ChartsSection').then(
      module => module.default), { ssr: false }
)
