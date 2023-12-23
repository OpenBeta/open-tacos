import { ReactNode } from 'react'

/**
 * Reusable section container
 */
export const SectionContainer: React.FC<{ children: ReactNode, id: string } > = ({ id, children }) => (
  <div id={id}>
    <section className='mt-2 w-full flex flex-col gap-y-8'>
      {children}
    </section>
  </div>
)

/**
 * Reusable page container
 */
export const PageContainer: React.FC<{ children: ReactNode } > = ({ children }) => (
  <div className='grid grid-cols-1 gap-y-8'>
    {children}
  </div>
)
