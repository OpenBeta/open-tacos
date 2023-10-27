'use client'
import { useState } from 'react'

/**
 * Show email on click to minimize spam
 */
export const ShowEmailJS: React.FC = () => {
  const [email, setEmail] = useState < string | null>()

  return (<button onClick={() => setEmail('hello@openbeta.io')} className='btn btn-primary btn-sm'>Email us {email != null && <a href={`mailto:${email}`}>{email}</a>}</button>)
}
