interface Props{
  dateClimbed: string
  notes: string
  style: string
}

export default function TickCard ({ dateClimbed, notes, style }: Props): JSX.Element {
  return (
    <div className='flex flex-row justify-between px-3 py-3 mb-3 border-2 rounded-lg border-slate-100'>
      <div className='flex flex-col'>
        <p className='text-md text-left text-gray-500'>{dateClimbed}</p>
        <p className='text-sm text-gray-500 mb-0'>{notes}</p>
      </div>
      <div className='flex flex-row'>
        <p className='text-sm text-gray-500 pr-5'>{style}</p>
      </div>
    </div>
  )
}
