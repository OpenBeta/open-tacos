import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { getTicksByUserAndClimb } from '../../js/graphql/api'
import { TickType } from '../../js/types'
import TickForm from './TickForm'
import TicksModal from './TicksModal'

interface Props {
  climbId: string
  areaId?: string
  name?: string
  grade?: string
}

const IsTicked: React.FC<any> = ({ loading, onClick }) => {
  return (
    <button
      type='button'
      disabled={loading}
      onClick={onClick}
      className='btn btn-primary btn-sm'
    >👀 View Ticks
    </button>
  )
}

export default function TickButton ({ climbId, areaId, name, grade }: Props): JSX.Element | null {
  const [loading, setLoading] = useState(false)
  const [isTicked, setIsTicked] = useState<boolean>(false)
  const [viewTicks, setViewTicks] = useState<boolean>(false)
  const [ticks, setTicks] = useState<TickType[]>([])
  const [open, setOpen] = useState(false)
  const session = useSession()

  useEffect(() => {
    getTicks()
  }, [])

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
          type='button'
          onClick={() => setOpen(true)}
          className='btn btn-primary btn-sm'
        >
          {loading
            ? (
              <span className='animate-pulse'>
                Working on it...
              </span>
              )
            : 'Tick this climb'}
        </button>}
      {isTicked && <IsTicked loading={loading} onClick={() => setViewTicks(true)} />}
      <TickForm open={open} setTicks={setTicks} ticks={ticks} setOpen={setOpen} isTicked={setIsTicked} climbId={climbId} name={name} grade={grade} />
      <TicksModal open={viewTicks} setOpen={setViewTicks} climbName={name} ticks={ticks} setTicks={setTicks} setOpenForm={setOpen} />
    </>
  )
}
