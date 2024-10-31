import { Climb } from '@/js/types'

export const ContentBlock: React.FC<Pick<Climb, 'content'>> = ({ content: { description, location, protection } }) => {
  return (
    <>
      <div className='mb-3 flex justify-between items-center'>
        <h3>Description</h3>
      </div>
      {description}

      {(location?.trim() !== '') && (
        <>
          <h3 className='mb-3 mt-6'>Location</h3>
          {location}
        </>
      )}

      {(protection?.trim() !== '') && (
        <>
          <h3 className='mb-3 mt-6'>Protection</h3>
          {protection}
        </>
      )}
    </>
  )
}
