interface BackerCardProps {
  name: string
  imageUrl: string
}

export default function BackerCard ({ name, imageUrl }: BackerCardProps): JSX.Element {
  return (
    <div className='shadow-lg card card-compact card-side bg-amber-500 w-fit rounded-box overflow-hidden'>
      <div className='avatar'>
        <div className='rounded w-12'>
          <img src={imageUrl} />
        </div>
      </div>
      <div className='card-body text-xs capitalize mx-4'>
        {name}
      </div>
    </div>
  )
}
