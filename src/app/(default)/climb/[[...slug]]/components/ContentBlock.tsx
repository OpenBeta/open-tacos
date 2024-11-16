import { Climb } from '@/js/types'
import Markdown from 'react-markdown'

export const ContentBlock: React.FC<Pick<Climb, 'content'>> = ({ content: { description, location, protection } }) => {
  return (
    <>
      <div className='mb-3 flex justify-between items-center'>
        <h3>Description</h3>
      </div>
      <Markdown className='wiki-content'>{description}</Markdown>
      {(location?.trim() !== '') && (
        <>
          <h3 className='mb-3 mt-6'>Location</h3>
          <Markdown className='wiki-content'>{location}</Markdown>
        </>
      )}

      {(protection?.trim() !== '') && (
        <>
          <h3 className='mb-3 mt-6'>Protection</h3>
          <Markdown className='wiki-content'>{protection}</Markdown>
        </>
      )}
    </>
  )
}
