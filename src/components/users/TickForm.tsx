import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { TickType } from '../../js/types'
import { graphqlClient } from '../../js/graphql/Client'
import { MUTATION_ADD_TICK } from '../../js/graphql/gql/fragments'
import ComboBox from '../ui/ComboBox'
import * as Yup from 'yup'

// validation schema for ticks
const TickSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Minimum 2 characters')
    .required('Something went wrong, please try again'),
  notes: Yup.string()
    .max(400, 'Notes can be a maximum of 400 characters'),
  climbId: Yup.string()
    .required('Something went wrong fetching the climb Id, please try again'),
  userId: Yup.string()
    .required('Something went wrong fetching your user Id, please try again'),
  style: Yup.string()
    .required('Please choose an ascent style'),
  attemptType: Yup.string()
    .required('Please choose an ascent type'),
  dateClimbed: Yup.date()
    .required('Please include a date'),
  grade: Yup.string()
    .required('Something went wrong fetching the climbs grade, please try again')
})
/**
 * Options for the dropdown comboboxes
 * Feel free to add any you think are valuable for our users
 */
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

interface Props{
  open: boolean
  setOpen: Function
  setTicks: Function
  ticks: TickType[]
  isTicked: Function
  climbId: string
  name?: string
  grade?: string
}

export default function TickForm ({ open, setOpen, setTicks, ticks, isTicked, climbId, name, grade }: Props): JSX.Element {
  const [style, setStyle] = useState(styles[1])
  const [attemptType, setAttemptType] = useState(attemptTypes[1])
  const [dateClimbed, setDateClimbed] = useState<Date>(new Date()) // default is today for dateClimbed
  const [notes, setNotes] = useState<string>('')
  const [errors, setErrors] = useState<string[]>()
  const session = useSession()
  const [addTick] = useMutation(
    MUTATION_ADD_TICK, {
      client: graphqlClient,
      errorPolicy: 'none'
    })

  /**
   * reset our inputs whenever a form is successfully submitted
   *
   */
  function resetInputs (): void {
    setDateClimbed(new Date())
    setAttemptType(attemptTypes[1])
    setNotes('')
    setStyle(styles[1])
  }

  async function submitTick (): Promise<void> {
    // build a tick object to send to the GraphQL backend
    const tick = {
      name: name,
      notes: notes,
      climbId: climbId,
      userId: session.data?.user.metadata.uuid,
      style: style.name,
      attemptType: attemptType.name,
      dateClimbed: dateClimbed,
      grade: grade,
      source: 'OB' // source manually set as Open Beta
    }
    // validate the tick object using the YUP schema declared above
    // if it doesn't validate or there is some sort of error, render the errors in the form
    TickSchema.validate(tick)
      .then(async (validTick) => {
        const newTick = await addTick({
          variables: {
            input: validTick
          }
        })
        if (newTick.data !== null) {
          const { data } = newTick
          // if the tick is persisted in the database
          // change the ticks button to the isticked button
          isTicked(true)
          // todo: add new tick to store whenever that is setup???
          setOpen(false)
          resetInputs()
          // add tick to the previous state
          const newTicks = [...ticks, data.addTick]
          setTicks(newTicks)
        }
      })
      .catch((error) => {
        const err = error.graphQLErrors[0]
        if (err.extensions.exception.code === 11000 || err.extensions.exception.code === 11001) {
          setErrors(['Error, duplicate tick found'])
        } else {
          setErrors([error.message])
        }
      })
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={() => setOpen(false)}>
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
                  {(errors != null) && errors.length > 0 && errors.map((err, i) => <p className='mt-2 text-ob-primary' key={i}>{err}</p>)}
                  <label htmlFor='date' className='block text-sm font-medium text-gray-700'>
                    Date Climbed
                  </label>
                  <div className='mt-1'>
                    <input
                      type='date'
                      name='date'
                      value={dateClimbed.toLocaleDateString()}
                      onChange={(e) => setDateClimbed(new Date(e.target.value))}
                      id='date'
                      className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                    />
                  </div>
                  <ComboBox options={styles} value={style} onChange={setStyle} label='Style' />
                  <ComboBox options={attemptTypes} value={attemptType} onChange={setAttemptType} label='Attempt Type' />
                  <div>
                    <label htmlFor='comment' className='block text-sm font-medium text-gray-700 mt-2'>
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
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6'>
                  <button
                    type='button'
                    className='text-center p-2 border-2 rounded-xl border-ob-primary transition
                      text-ob-primary hover:bg-ob-primary hover:ring hover:ring-ob-primary ring-offset-2
                      hover:text-white w-64 font-bold'
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
