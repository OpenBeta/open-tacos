
import React from 'react'
import Pencil from '../../assets/icons/pencil-sm.svg'
import EditButton from './EditButton'
interface CtaProps {
  isEmpty: boolean
  rawPath: string
}
const Cta: React.FC<CtaProps> = ({ isEmpty, rawPath }) => (
  <div className='my-8 rounded border-2 p-4 border-gray-600 flex flex-col flex-nowrap gap-y-4 md:gap-x-4 md:flex-row  items-center justify-center '>
    <div className='text-center'>
      {isEmpty
        ? 'This area description is empty. Be the first to contribute!'
        : 'Help us improve this page'}
    </div>
    <div>
      <EditButton
        icon={<Pencil className='inline w-4 h-4' />}
        label='Edit'
        classes='btn-primary'
        rawPath={rawPath}
      />
    </div>
  </div>
)
export default Cta
