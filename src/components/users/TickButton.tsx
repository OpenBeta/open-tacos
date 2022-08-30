import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { getTicksByUserAndClimb } from '../../js/graphql/api'
import { TickType } from '../../js/types'
import TickForm from './TickForm'

interface Props {
  climbId: string
  areaId?: string
  name?: string
  grade?: string
}

function IsTicked ({ loading, onClick }): JSX.Element {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className='mt-2 text-center p-2 border-2 rounded-xl border-ob-primary transition
        text-ob-primary hover:bg-ob-primary hover:ring hover:ring-ob-primary ring-offset-2
        hover:text-white w-64 font-bold'
    >👀 View Ticks
    </button>
  )
}

export default function TickButton ({ climbId, areaId, name, grade }: Props): JSX.Element | null {
  const [loading, setLoading] = useState(false)
  const [isTicked, setIsTicked] = useState<boolean>(false)
  // const [viewTicks, setViewTicks] = useState<boolean>(false)
  const [ticks, setTicks] = useState<TickType[]>([])
  const [open, setOpen] = useState(false)
  const session = useSession()

  useEffect(() => {
    getTicks()
  }, [ticks])

  function getTicks (): void {
    const userId = session.data?.user.metadata.uuid ?? ''
    if (userId !== '') {
      setLoading(true)
      getTicksByUserAndClimb(climbId, userId)
        .then((data) => {
          if (data.length > 0) {
            setTicks(data)
            setIsTicked(true)
          } else {
            setTicks(data)
          }
        }
        )
        .finally(() => {
          setLoading(false)
        })
    }
  }

  // If there is some kind of programming error / user is un-authenticated we render nothing
  if ((climbId === undefined && areaId === null) || session.status === 'unauthenticated') {
    return null
  }

  return (
    <>
      {!isTicked &&
        <button
          disabled={loading}
          onClick={() => setOpen(true)}
          className='mt-2 text-center p-2 border-2 rounded-xl border-ob-primary transition
        text-ob-primary hover:bg-ob-primary hover:ring hover:ring-ob-primary ring-offset-2
        hover:text-white w-64 font-bold'
        >
          {loading
            ? (
              <span className='animate-pulse'>
                Working on it...
              </span>
              )
            : 'Tick this climb'}
        </button>}
      {isTicked && <IsTicked loading={loading} onClick={() => getTicks()} />}
      <TickForm open={open} setOpen={setOpen} isTicked={setIsTicked} climbId={climbId} name={name} grade={grade} />
    </>
  )
}
