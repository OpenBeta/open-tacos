import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { FolderArrowDownIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@apollo/client'
import { signIn, useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import clx from 'classnames'

import { graphqlClient } from '../../js/graphql/Client'
import { MUTATION_IMPORT_TICKS } from '../../js/graphql/gql/fragments'
import { INPUT_DEFAULT_CSS } from '../ui/form/TextArea'
import Spinner from '../ui/Spinner'
import { LeanAlert } from '../ui/micro/AlertDialogue'

interface Props {
  isButton: boolean
  username: string
}
// regex pattern to validate mountain project input
const pattern = /^https:\/\/www.mountainproject.com\/user\/\d{9}\/[a-zA-Z-]*/

/**
 *
 * @prop isButton -- a true or false value
 *
 * if the isButton prop is true, the component will be rendered as a button
 * if the isButton prop is false, the component will be rendered as a modal
 * @returns JSX element
 */
export function ImportFromMtnProj ({ isButton, username }: Props): JSX.Element {
  const router = useRouter()
  const [mpUID, setMPUID] = useState('')
  const session = useSession()
  const [show, setShow] = useState<boolean>(false)
  const [showInput, setShowInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [addTicks] = useMutation(
    MUTATION_IMPORT_TICKS, {
      client: graphqlClient,
      errorPolicy: 'none'
    })

  // this function updates the users metadata
  async function dontShowAgain (): Promise<void> {
    setLoading(true)
    const res = await fetch('/api/user/ticks', {
      method: 'PUT',
      body: ''
    })
    if (res.status === 200) {
      setShow(false)
    } else {
      setErrors(['Sorry, something went wrong. Please try again later'])
    }
    setLoading(false)
  }

  // this function is for when the component is rendered as a button and sends the user straight to the input form
  function straightToInput (): void {
    if (session.status !== 'authenticated') {
      void signIn('auth0')
    } else {
      setShowInput(true)
      setShow(true)
    }
  }

  async function getTicks (): Promise<void> {
    // get the ticks and add it to the database
    setErrors([])
    if (pattern.test(mpUID)) {
      setLoading(true)
      const res = await fetch('/api/user/ticks', {
        method: 'POST',
        body: JSON.stringify(mpUID)
      })
      if (res.status === 200) {
        setShow(false)
        const { ticks } = await res.json()
        await addTicks({
          variables: {
            input: ticks
          }
        })

        // Add a delay before rerouting to the new page
        const ticksCount: number = ticks?.length ?? 0
        toast.info(
          <>
            {ticksCount} ticks have been imported! 🎉 <br />
            Redirecting in a few seconds...`
          </>
        )

        setTimeout(() => {
          void router.replace(`/u2/${username}`)
        }, 2000)
      } else {
        setErrors(['Sorry, something went wrong. Please try again later'])
        toast.error("We couldn't import your ticks. Please try again later.")
      }
    } else {
      // handle errors
      setErrors(['Please input a valid Mountain Project ID'])
    }
    setLoading(false)
  }

  useEffect(() => {
    // if we aren't rendering this component as a button
    // and the user is authenticated we want to show the import your ticks modal
    // then we check to see if they have a ticks imported flag set
    // if it is, set show to the opposite of whatever it is
    // otherwise don't show the modal
    if (!isButton) {
      fetch('/api/user/profile')
        .then(async res => await res.json())
        .then((profile) => {
          if (profile?.ticksImported !== null) {
            setShow(profile.ticksImported !== true)
          } else if (session.status === 'authenticated') {
            setShow(true)
          } else {
            setShow(false)
          }
        }).catch(console.error)
    }
  }, [session])

  // if the isButton prop is passed to this component as true, the component will be rendered as a button, otherwise it will be a modal
  return (
    <>
      {isButton && <button onClick={straightToInput} className='btn btn-xs md:btn-sm btn-primary'>Import ticks</button>}

      {show && (
        <LeanAlert
          icon={<FolderArrowDownIcon className='h-6 w-6 text-gray-400' aria-hidden='true' />}
          title={showInput ? 'Input your Mountain Project profile link' : 'Import your ticks from Mountain Project'}
          description={!showInput ? "Don't lose your progress, bring it over to Open Beta." : null}
          closeOnEsc
          stackChildren
        >
          {(errors != null) && errors.length > 0 && errors.map((err, i) => <p className='mt-2 text-ob-primary' key={i}>{err}</p>)}

          {showInput && (
            <div className='mt-1 relative rounded-md shadow-sm'>
              <input
                type='text'
                name='website'
                id='website'
                value={mpUID}
                onChange={(e) => setMPUID(e.target.value)}
                className={clx(INPUT_DEFAULT_CSS, 'w-full')}
                placeholder='https://www.mountainproject.com/user/123456789/username'
              />
            </div>
          )}

          <div className='mt-3 flex space-x-7 justify-center'>
            {!showInput && (
              <button
                type='button'
                onClick={() => setShowInput(true)}
                className='text-center p-2 border-2 rounded-xl border-ob-primary transition
                text-ob-primary hover:bg-ob-primary hover:ring hover:ring-ob-primary ring-offset-2
                hover:text-white w-32 font-bold'
              >
                {loading ? 'Working...' : 'Show me how'}
              </button>
            )}

            {showInput && (
              <button
                type='button'
                onClick={getTicks}
                className='btn btn-primary'
              >
                {loading ? <Spinner /> : 'Get my ticks!'}
              </button>
            )}

            {!isButton && (
              <button
                type='button'
                onClick={dontShowAgain}
                className='bg-white rounded-md text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                {loading ? 'Working...' : "Don't show again"}
              </button>
            )}

            <AlertDialogPrimitive.Cancel
              asChild onClick={() => {
                setShow(false)
                setErrors([])
              }}
            >
              <button className='Button mauve'>Cancel</button>
            </AlertDialogPrimitive.Cancel>
          </div>
        </LeanAlert>
      )}
    </>
  )
}

export default ImportFromMtnProj
