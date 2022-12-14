interface BackerCardProps {
  name: string
  imageUrl: string
}

export default function BackerCard ({ name, imageUrl }: BackerCardProps): JSX.Element {
  return (
    <div className='shadow-lg card card-bordered card-compact bg-info'>
      <div className='card-body items-center'>
        <div className='avatar'>
          <div className='rounded-full w-16'>
            <img src={imageUrl} />
          </div>
        </div>
        <div className='text-center text-sm capitalize'>
          {name}
        </div>
      </div>
    </div>
  )
}
