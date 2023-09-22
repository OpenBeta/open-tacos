import { MUTATION_REMOVE_TICK_BY_ID } from '../../js/graphql/gql/fragments'
import { graphqlClient } from '../../js/graphql/Client'
import { useMutation } from '@apollo/client'
import AlertDialogue from '../ui/micro/AlertDialogue'
import { TickType } from '../../js/types'

interface Props {
  ticks: TickType[]
  setTicks: Function
  tickId: string
  dateClimbed: number
  notes: string
  style: string
}

export default function TickCard ({ tickId, ticks, setTicks, dateClimbed, notes, style }: Props): JSX.Element {
  const [deleteTick] = useMutation(
    MUTATION_REMOVE_TICK_BY_ID, {
      client: graphqlClient,
      errorPolicy: 'none'
    })

  const remove = async (): Promise<void> => {
    const { data } = await deleteTick({
      variables: {
        _id: tickId
      }
    })
    if (data?.deleteTick?.removed === true) {
      setTicks(ticks.filter(tick => tick._id !== tickId))
    }
  }
  return (
    <div className='flex flex-row justify-between px-3 py-3 mb-3 border-2 rounded-lg border-slate-100' id={tickId}>
      <div className='flex flex-col'>
        <p className='text-md text-left text-gray-500'>{new Date(dateClimbed).toLocaleDateString()}</p>
        <p className='text-sm text-gray-500 mb-0'>{notes}</p>
      </div>
      <div className='flex flex-row'>
        <p className='text-sm text-gray-500 pr-5'>{style}</p>
        <AlertDialogue
          onConfirm={() => { void remove() }}
          hideTitle
          button={(
            <button type='button'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10 md:w-8 md:h-8 md:marker:w-8 text-rose-100 bg-rose-500 ring-rose-500 hover:bg-rose-600
            hover:ring ring-offset-1 rounded-full p-1 transition'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
              </svg>
            </button>)}
        >
          <div className='text-center'>
            Delete tick?
            <div className='text-rose-600 font-bold text-lg'>
              This cannot be undone
            </div>
          </div>
        </AlertDialogue>
      </div>
    </div>
  )
}
