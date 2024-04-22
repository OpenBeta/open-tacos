import { ReactNode } from 'react'

interface Props {
  columns: {
    left: ReactNode
    right?: ReactNode
  }
}

export const Summary: React.FC<Props> = ({ columns: { left, right } }) => (
  <div className='area-summary'>
    <div className='area-summary-left'>{left}</div>
    {right != null ? <div className='area-summary-right'>{right}</div> : null}
  </div>
)
