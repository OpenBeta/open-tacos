import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { APIFavouriteCollections } from '../../pages/api/user/fav'
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

/** Assuming that there is a generic 'favourites' collection for the time being. */
const favCollection = 'favourites'

/** Built for rapid single-instancing. This component payloads its own network requests
 * so don't go making many instances without hoisting the requests into a parent.
 */
export default function TickButton ({ climbId, areaId, name, grade }: Props): JSX.Element | null {
  const [loading, setLoading] = useState(false)
  const [isTicked, setIsTicked] = useState<boolean>(false)
  const [open, setOpen] = useState(true)
  const session = useSession()

  useEffect(() => {
    setLoading(true)
    fetch('/api/user/ticks')
      .then(async res => await res.json())
      .then((collections: APIFavouriteCollections) => {
        if (climbId !== undefined) {
          const f = collections.climbCollections[favCollection]
          if (f === undefined) {
            setIsTicked(false)
            return
          }

          setIsTicked(f.includes(climbId))
          return // guard block
        }

        if (areaId !== undefined) {
          const f = collections.areaCollections[favCollection]
          if (f === undefined) {
            setIsTicked(false)
            return
          }

          setIsTicked(f.includes(areaId))
          // guard block
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false)
      })
  }, [climbId, areaId])

  const toggle = (): void => {
    // open modal to input tick data
    setOpen(true)
    // let method = 'PUT'
    // if (isTicked) {
    //   method = 'DELETE'
    // }

    // fetch('/api/user/ticks', {
    //   method: method,
    //   body: JSON.stringify({ climbId, areaId, collection: favCollection })
    // })
    //   .then(() => setIsTicked(!isTicked))
    //   .catch(err => console.error({ err }))
    //   .finally(() => {
    //     setLoading(false)
    //   })
  }

  // If there is some kind of programming error / user is un-authenticated we render the default
  // interaction-devoid button
  if ((climbId === undefined && areaId === null) || session.status === 'unauthenticated') {
    return <NoLogin />
  }

  return (
    <>
      <button
        disabled={loading}
        onClick={toggle}
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
          : (!isTicked ? 'Tick this climb' : 'Remove tick')}
      </button>
      <TickForm open={open} setOpen={setOpen} climbId={climbId} name={name} grade={grade} />
    </>
  )
}
