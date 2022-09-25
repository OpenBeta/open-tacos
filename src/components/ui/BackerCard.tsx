interface BackerCardProps {
  name: string
  imageUrl: string
}

function BackerCard ({ name, imageUrl }: BackerCardProps): JSX.Element {
  return (
    <div className='border-solid border-2 rounded-md shadow-xl max-w-xs my-3 pt-3'>
      <div className='flex justify-center'>
        <img className='rounded-md border-solid border-white border-2' src={imageUrl} />
      </div>
      <div className='text-center px-3 pb-6 pt-2'>
        <h3>{name}</h3>
      </div>
    </div>
  )
}

export default BackerCard
