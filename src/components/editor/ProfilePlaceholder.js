import React from 'react'
import {
  TextBlock
} from 'react-placeholder/lib/placeholders'

const ProfilePlaceholder = () => (
  <div className='editor-profile-container'>
    <div className='editor-profile-header'>Profile</div>
    <div className='p-4 '>
      <TextBlock rows={5} color='#E5E7EB' />
    </div>
  </div>
)

export default ProfilePlaceholder
