interface BackerCardProps {
  name: string
  imageUrl: string
}

export default function BackerCard ({ name, imageUrl }: BackerCardProps): JSX.Element {
  return (
    <div className='shadow-lg card card-compact bg-amber-500'>
      <div className='card-body items-center'>
        <div className='avatar'>
          <div className='rounded-full w-12'>
            <img src={imageUrl} />
          </div>
        </div>
        <div className='text-center text-xs capitalize'>
          {name}
        </div>
      </div>
    </div>
  )
}
