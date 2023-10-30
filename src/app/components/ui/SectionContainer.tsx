import { ReactNode } from 'react'

interface Props {
  header: ReactNode
  children: ReactNode
}
export const SectionContainer: React.FC<Props> = ({ header, children }) => {
  return (
    <section className='block w-full px-4 2xl:px-0 mx-auto max-w-5xl xl:max-w-7xl'>
      {header}
      <hr className='mb-6 border-2 border-base-content' />
      {children}
    </section>
  )
}
