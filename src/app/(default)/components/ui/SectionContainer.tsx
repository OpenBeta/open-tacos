import { ReactNode } from 'react'
import clx from 'classnames'

export enum Padding {
  none = '',
  default = 'p-4 lg:p-8'
}

interface Props {
  header: ReactNode
  children: ReactNode
  className?: string
  padding?: Padding
}

/**
 * Reusable wide-screen container for root page
 */
export const SectionContainer: React.FC<Props> = ({ header, children, className = '', padding = Padding.none }) => (
  <section className={clx('block w-full', padding, className)}>
    {header}
    <hr className='mb-6 border-2 border-base-content' />
    {children}
  </section>
)
