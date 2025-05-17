import { ReactElement } from 'react'
import { CardContentPlaceholder } from './CardContentPlaceholder'

interface RhsContainerProps {
  loaded: boolean
  userinfo: ReactElement
  content: ReactElement
  footer?: null | ReactElement
}

export const RhsContainer = ({ loaded, userinfo, content, footer = null }: RhsContainerProps): React.ReactNode => {
  return loaded
    ? (
      <div className='flex flex-col justify-start h-[inherit] lg:max-w-[400px] min-w-[350px] bg-white'>
        <div className='grow flex-col flex'>
          <div className='border-b px-4 py-4'>
            {userinfo}
          </div>
          <div className='px-4 grow flex flex-col'>
            {content}
          </div>
        </div>
        <div className='border-t'>
          {footer}
        </div>
      </div>
      )
    : (<CardContentPlaceholder uniqueKey='1' />)
}
