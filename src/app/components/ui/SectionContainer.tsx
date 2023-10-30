import { ReactNode } from 'react'
import clx from 'classnames'

export enum Width {
  wide = '2xl:p-0',
  compact = 'xl:p-10'
}

interface Props {
  header: ReactNode
  children: ReactNode
  className?: string
  width?: Width
}

/**
 * Reusable wide-screen container for root page
 */
export const SectionContainer: React.FC<Props> = ({ header, children, className = '', width = Width.wide }) => (
  <section className={clx('block w-full p-4  mx-auto max-w-5xl xl:max-w-7xl', width, className)}>
    {header}
    <hr className='mb-6 border-2 border-base-content' />
    {children}
  </section>
)
