import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

interface Props {
  climbId?: string
  areaId?: string
}

function NoLogin (): JSX.Element {
  return (
    <button
      onClick={async () => await signIn('auth0', { callbackUrl: '/api/user/me' })}
      disabled
      className='text-center p-2 px-3 border-2 rounded-xl border-ob-primary transition
        text-ob-primary hover:bg-slate-700 hover:ring hover:ring-slate-700 ring-offset-2
        hover:text-white hover:border-slate-700'
    >
      ❤️ Login to Favourite
    </button>
  )
}

/** Assuming that there is a generic 'favourites' collection for the time being. */
const favCollection = 'favourites'

/** Built for rapid single-instancing. This component payloads its own network requests
 * so don't go making many instances without hoisting the requests into a parent.
 */
export default function FavouriteButton ({ climbId, areaId }: Props): JSX.Element | null {
  const [loading, setLoading] = useState(false)
  const [isFav, setIsFav] = useState<boolean>(false)
  const session = useSession()

  useEffect(() => {
    setLoading(true)
    fetch('/api/user/fav')
      .then(async res => await res.json())
      .then(res => {
        if (climbId !== undefined) {
          setIsFav(res.climbCollections[favCollection]?.includes(climbId))
        } else {
          setIsFav(res.areaCollections[favCollection]?.includes(areaId))
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false)
      })
  }, [climbId, areaId])

  const toggle = (): void => {
    setLoading(true)
    let method = 'POST'
    if (isFav) {
      method = 'DELETE'
    }

    fetch('/api/user/fav', {
      method: method,
      body: JSON.stringify({ climbId, areaId, collection: favCollection })
    })
      .catch(err => console.error({ err }))
      .finally(() => {
        setLoading(false)
        setIsFav(!isFav)
      })
  }

  // If there is some kind of programming error / user is un-authenticated we render the default
  // interaction-devoid button
  if ((climbId === undefined && areaId === null) || session.status === 'unauthenticated') {
    return <NoLogin />
  }

  return (
    <button
      disabled={loading}
      onClick={toggle}
      className='text-center p-2 border-2 rounded-xl border-ob-primary transition
        text-ob-primary hover:bg-ob-primary hover:ring hover:ring-ob-primary ring-offset-2
        hover:text-white w-64 font-bold'
    >
      {loading
        ? (
          <span className='animate-pulse'>
            Working on it...
          </span>
          )
        : (!isFav ? '❤️ Add to Favourites' : '💔 Remove from favourites')}
    </button>
  )
}
