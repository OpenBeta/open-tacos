
import React from 'react'

interface EditButtonProps {
  icon?: React.ReactElement
  label?: string
  classes?: string
  rawPath: string
}

const EditButton: React.FC<EditButtonProps> = ({ icon, label, classes, rawPath }) => {
  const iconClass = (icon != null) ? 'px-4' : ''
  return (
    <button
      className={`btn whitespace-nowrap ${classes ?? 'btn-secondary'} ${iconClass
        }`}
      onClick={(e) => {
        e.preventDefault()
        // @gibboj was gatsby.navigate(/edit?file=${rawPath}/index.md`)
        void console.log(`/edit?file=${rawPath}/index.md`)
      }}
    >
      <span className='mr-2'>{icon}</span>
      {label}
    </button>
  )
}
export default EditButton
