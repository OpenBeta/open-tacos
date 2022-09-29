import { Fragment, useEffect, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { DocumentDownloadIcon } from '@heroicons/react/outline'
import { XIcon } from '@heroicons/react/solid'
import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { stagingGraphQLClient } from '../../js/graphql/Client'
import { Button, ButtonVariant } from '../ui/BaseButton'
import { MUTATION_IMPORT_TICKS } from '../../js/graphql/fragments'
import forOwnerOnly from '../../js/auth/forOwnerOnly'
import { WithOwnerProfile } from '../../js/types/User'

interface Props extends WithOwnerProfile {
  isButton: boolean
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
function ImportFromMtnProj ({ isButton }: Props): JSX.Element {
  const [mpUID, setMPUID] = useState('')
  const session = useSession()
  const [show, setShow] = useState<boolean>(false)
  const [showInput, setShowInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [addTicks] = useMutation(
    MUTATION_IMPORT_TICKS, {
      client: stagingGraphQLClient,
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
    setShowInput(true)
    setShow(true)
  }

  async function getTicks (): Promise<void> {
    // get the ticks and add it to the database
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
      } else {
        setErrors(['Sorry, something went wrong. Please try again later'])
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

  useEffect(() => {
    // if the user is authenticated we want to show the import your ticks modal
    // then we check to see if they have a ticks imported flag set
    // if it is, set show to the opposite of whatever it is
    // otherwise don't show the modal
    fetch('/api/user/profile')
      .then(async res => await res.json())
      .then((profile) => {
        if (profile?.ticksImported !== null) {
          setShow(profile.ticksImported !== true)
        } else if (session.status === 'authenticated') {
          setShow(false)
        } else {
          setShow(false)
        }
      }).catch(console.error)
  }, [session])

  return (
    <>
      {isButton && <Button onClick={straightToInput} label='Import Ticks' variant={ButtonVariant.OUTLINED_DEFAULT} size='sm' />}
      <div
        aria-live='assertive'
        className='fixed inset-0 z-10 flex items-end px-4 py-6 mt-24 pointer-events-none sm:p-6 sm:items-start'
      >
        <div className='w-full flex flex-col items-center space-y-4 sm:items-end'>
          <Transition.Root
            show={show}
            as={Fragment}
            enter='transform ease-out duration-300 transition'
            enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
            enterTo='translate-y-0 opacity-100 sm:translate-x-0'
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='max-w-xl w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'>
              <div className='p-4'>
                <div className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <DocumentDownloadIcon className='h-6 w-6 text-gray-400' aria-hidden='true' />
                  </div>
                  <div className='ml-3 w-0 flex-1 pt-0.5'>
                    {(errors != null) && errors.length > 0 && errors.map((err, i) => <p className='mt-2 text-ob-primary' key={i}>{err}</p>)}
                    <p className='text-sm font-medium text-gray-900'>{showInput ? 'Input your mountain project profile link' : 'Import your ticks from Mtn Project'}</p>
                    {!showInput &&
                      <p className='mt-1 text-sm text-gray-500'>
                        Don't loose your progress, bring it over to Open Beta.
                      </p>}
                    {showInput &&
                      <div>
                        <div className='mt-1 relative rounded-md shadow-sm'>
                          <input
                            type='text'
                            name='website'
                            id='website'
                            value={mpUID}
                            onChange={(e) => setMPUID(e.target.value)}
                            className='focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                            placeholder='https://www.mountainproject.com/user/123456789/username'
                          />
                        </div>
                      </div>}
                    <div className='mt-3 flex space-x-7'>
                      {!showInput &&
                        <button
                          type='button'
                          onClick={() => setShowInput(true)}
                          className='text-center p-2 border-2 rounded-xl border-ob-primary transition
                          text-ob-primary hover:bg-ob-primary hover:ring hover:ring-ob-primary ring-offset-2
                          hover:text-white w-32 font-bold'
                        >
                          {loading ? 'Working...' : 'Show me how'}
                        </button>}
                      {showInput &&
                        <button
                          type='button'
                          onClick={getTicks}
                          className='text-center p-2 border-2 rounded-xl border-ob-primary transition
                          text-ob-primary hover:bg-ob-primary hover:ring hover:ring-ob-primary ring-offset-2
                          hover:text-white w-46 font-bold'
                        >
                          Get my ticks!
                        </button>}
                      {!isButton &&
                        <button
                          type='button'
                          onClick={dontShowAgain}
                          className='bg-white rounded-md text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                          {loading ? 'Working...' : "Don't show again"}
                        </button>}
                    </div>
                  </div>
                  <div className='ml-4 flex-shrink-0 flex'>
                    <button
                      type='button'
                      className='bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      onClick={() => {
                        setShow(false)
                      }}
                    >
                      <span className='sr-only'>Close</span>
                      <XIcon className='h-5 w-5' aria-hidden='true' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Root>
        </div>
      </div>
    </>
  )
}

export default forOwnerOnly<Props>(ImportFromMtnProj)
