import { Fragment, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { DocumentDownloadIcon } from '@heroicons/react/outline'
import { XIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'

// regex: ^\d{9}\/ -- matches the first 9 digits and a slash

function ImportFromMtnProj (): JSX.Element | null {
  const [mpUID, setMPUID] = useState('')
  const session = useSession()
  const [show, setShow] = useState(false)
  const [showInput, setShowInput] = useState(false)

  async function getTicks (): Promise<void> {
    // get the ticks and add it to the users metadata
    // need regex to verify mtn project ID
    const ret = await fetch('/api/user/ticks', {
      method: 'PUT',
      body: JSON.stringify(mpUID)
    })
    const collections = await ret.json()
    if (ret.status === 200) {
      console.log(collections)
      setShow(false)
      // do the fetch from mtn project and store that data in the Auth0 metadata
    } else {
      console.log(ret)
    }
  }

  useEffect(() => {
    // if the user is authenticated we want to show the import your ticks modal
    console.log(session.data?.user?.metadata?.collections)
    if (session.status === 'authenticated') setShow(true)
    // then we check to see if they have a ticks imported flag set
    // if it is, set show to the opposite of whatever it is
    if (session.data?.user?.metadata?.ticksImported != null) {
      setShow(!session.data?.user?.metadata?.ticksImported)
    }
  }, [session])

  return (
  // if the modal prop is true we want to render this component as a notification/modal
  // otherwise we want it to be a button
    <>
      <div
        aria-live='assertive'
        className='fixed inset-0 flex items-end px-4 py-6 mt-24 pointer-events-none sm:p-6 sm:items-start'
      >
        <div className='w-full flex flex-col items-center space-y-4 sm:items-end'>
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter='transform ease-out duration-300 transition'
            enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
            enterTo='translate-y-6 opacity-100 sm:translate-x-0'
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'>
              <div className='p-4'>
                <div className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <DocumentDownloadIcon className='h-6 w-6 text-gray-400' aria-hidden='true' />
                  </div>
                  <div className='ml-3 w-0 flex-1 pt-0.5'>
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
                            placeholder='https://www.mountainproject.com/user/200381859/brendan-downing'
                          />
                        </div>
                      </div>}
                    <div className='mt-3 flex space-x-7'>
                      {!showInput &&
                        <button
                          type='button'
                          onClick={() => setShowInput(true)}
                          className='bg-white rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                          Show me how
                        </button>}
                      {showInput &&
                        <button
                          type='button'
                          onClick={getTicks}
                          className='bg-white rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                          Get my ticks!
                        </button>}
                      <button
                        type='button'
                        className='bg-white rounded-md text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      >
                        Don't show again
                      </button>
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
          </Transition>
        </div>
      </div>
    </>
  )
}

export default ImportFromMtnProj