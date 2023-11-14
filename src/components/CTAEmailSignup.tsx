import React from 'react'

interface CTAEmailSignupProps {
  // Define specific types for props here if necessary
}
const CTAEmailSignup: React.FC<CTAEmailSignupProps> = (props) => (
  <iframe
    className='w-full bg-gray-600 p-4'
    src='https://openbeta.substack.com/embed'
    height='320'
    scrolling='no'
  />
)

export default CTAEmailSignup
