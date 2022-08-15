import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { graphqlClient } from '../../js/graphql/Client'
import { MUTATION_ADD_TICK } from '../../js/graphql/fragments'
import ComboBox from '../ui/ComboBox'

const styles = [
  { id: 1, name: 'Solo' },
  { id: 2, name: 'TR' },
  { id: 3, name: 'Follow' },
  { id: 4, name: 'Lead' },
  { id: 5, name: 'Boulder' }
]

const attemptTypes = [
  { id: 1, name: 'Onsight' },
  { id: 2, name: 'Flash' },
  { id: 3, name: 'Redpoint' },
  { id: 4, name: 'Pinkpoint' }
]
export default function TickForm ({ open, setOpen, climbId, name, grade }): JSX.Element {
  const [style, setStyle] = useState(styles[1])
  const [attemptType, setAttemptType] = useState(attemptTypes[1])
  const session = useSession()
  const [dateClimbed, setDateClimbed] = useState<string>(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState<string>()
  const [addTick] = useMutation(
    MUTATION_ADD_TICK, {
      client: graphqlClient,
      errorPolicy: 'none'
    })

  async function submitTick (): Promise<void> {
    const tick = {
      name: name,
      notes: notes,
      climbId: climbId,
      userId: session.data?.user.metadata.uuid,
      style: style.name,
      attemptType: attemptType.name,
      dateClimbed: dateClimbed,
      grade: grade
    }
    const newTick = await addTick({
      variables: {
        input: tick
      }
    })

    console.log(newTick)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed z-10 inset-0 overflow-y-auto'>
          <div className='flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6'>
                <div>
                  <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
                    <CheckIcon className='h-6 w-6 text-green-600' aria-hidden='true' />
                  </div>
                  <label htmlFor='date' className='block text-sm font-medium text-gray-700'>
                    Date Climbed
                  </label>
                  <div className='mt-1'>
                    <input
                      type='date'
                      name='date'
                      value={dateClimbed}
                      onChange={(e) => setDateClimbed(e.target.value)}
                      id='date'
                      className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                    />
                  </div>

                  <ComboBox options={styles} value={style} onChange={setStyle} label='Style' />
                  <ComboBox options={attemptTypes} value={attemptType} onChange={setAttemptType} label='Attempt Type' />
                  <div>
                    <label htmlFor='comment' className='block text-sm font-medium text-gray-700'>
                      Notes
                    </label>
                    <div className='mt-1'>
                      <textarea
                        rows={4}
                        name='comment'
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        id='comment'
                        className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                        defaultValue=''
                      />
                    </div>

                  </div>
                </div>
                <div className='mt-5 sm:mt-6'>
                  <button
                    type='button'
                    className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm'
                    onClick={submitTick}
                  >
                    Submit Tick
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
