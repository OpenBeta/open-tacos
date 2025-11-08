import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTicksByUser } from '@/js/graphql/api'
import { TickType } from '@/js/types'
import { UserTicksContent } from './UserTicksContent'

interface PageProps {
  params: { username: string } | Promise<{ username: string }>
}

async function getParams (params: PageProps['params']): Promise<{ username: string }> {
  return params instanceof Promise ? await params : params
}

export async function generateMetadata ({ params }: PageProps): Promise<Metadata> {
  const { username } = await getParams(params)

  return {
    title: `${username}'s Ticks - OpenBeta`,
    description: `View ${username}'s climbing logbook and tick list`
  }
}

export default async function UserTicksPage ({ params }: PageProps): Promise<React.JSX.Element> {
  const { username } = await getParams(params)

  if (username == null) {
    notFound()
  }

  let ticks: TickType[] = []
  try {
    ticks = await getTicksByUser({ username })
  } catch (e) {
    console.error('Error fetching ticks:', e)
    notFound()
  }

  return <UserTicksContent username={username} ticks={ticks} />
}

// Enable ISR with 10 second revalidation (matches original)
export const revalidate = 10
