import React from 'react'

function LinkToGithub ({ link, docType }) {
  return (
    <div className='mt-5 border-t-2 pt-5'>
      Do you want edit or add multiple {docType || 'documentations'}?
      &nbsp;
      <a target='_blank' rel='noopener noreferrer' href={link}>
        <span
          className='ml-0.5 hover:underline cursor-pointer hover:text-purple-900 text-purple-600'
        >
          Edit this page on GitHub!
        </span> (Expert mode)
      </a>
    </div>
  )
}

export default LinkToGithub
