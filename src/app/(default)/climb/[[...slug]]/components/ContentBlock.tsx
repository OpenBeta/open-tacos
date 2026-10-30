import { Climb } from '@/js/types'
import { WikiMarkdown } from '@/components/ui/WikiMarkdown'

export const ContentBlock: React.FC<Pick<Climb, 'content'>> = ({ content: { description, location, protection } }) => {
  return (
    <>
      <div className='mb-3 flex justify-between items-center'>
        <h3>Description</h3>
      </div>
      <WikiMarkdown>{description}</WikiMarkdown>
      {(location?.trim() !== '') && (
        <>
          <h3 className='mb-3 mt-6'>Location</h3>
          <WikiMarkdown>{location}</WikiMarkdown>
        </>
      )}

      {(protection?.trim() !== '') && (
        <>
          <h3 className='mb-3 mt-6'>Protection</h3>
          <WikiMarkdown>{protection}</WikiMarkdown>
        </>
      )}
    </>
  )
}
