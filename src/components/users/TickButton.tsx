import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import TickForm from './TickForm'

interface Props {
  climbId?: string
  areaId?: string
  name?: string
  grade?: string
}

function NoLogin (): JSX.Element {
  return (
    <button
      onClick={async () => await signIn('auth0', { callbackUrl: '/api/user/me' })}
      className='text-center p-2 px-3 border-2 rounded-xl border-ob-primary transition
        text-ob-primary hover:bg-slate-700 hover:ring hover:ring-slate-700 ring-offset-2
        hover:text-white hover:border-slate-700'
    >
      Login to tick
    </button>
  )
}

export default function TickButton ({ climbId, areaId, name, grade }: Props): JSX.Element | null {
  const [loading, setLoading] = useState(false)
  const [isTicked, setIsTicked] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const session = useSession()

  useEffect(() => {
    // query graphQL by climbID and userID and see if there is already a tick
    // if there is
    // set it to is ticked
    setLoading(false)
    setIsTicked(false)
  })

  // If there is some kind of programming error / user is un-authenticated we render the default
  // interaction-devoid button
  if ((climbId === undefined && areaId === null) || session.status === 'unauthenticated') {
    return <NoLogin />
  }

  return (
    <>
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
          : (!isTicked ? 'Tick this climb' : 'Tick again')}
      </button>
      <TickForm open={open} setOpen={setOpen} climbId={climbId} name={name} grade={grade} />
    </>
  )
}
