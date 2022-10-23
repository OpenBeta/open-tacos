import { MailIcon } from '@heroicons/react/outline'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import axios from 'axios'

function SignInPage (): JSX.Element {
  const router = useRouter()
  const session = useSession()
  const token = router.query?.session_token as string
  useEffect(() => {
    console.log('#Session token', token)
    const decodeToken = async (): Promise<any> => {
      // const key = await getDerivedEncryptionKey('top secret')
      // const { payload } = await jose.jwtVerify(token, 'top secret')
      const res = await axios.get('/api/user/tokenHelper?token=' + token)
      console.log('#token', res.data)
      return res.data
    }

    if (token != null) {
      void decodeToken()
    }
  })

  console.log('#Session', session)

  return (
    <div className='mt-8 max-w-sm mx-auto alert alert-info'>
      <div className='flex items-center gap-4'>
        <MailIcon className='w-16 h-16' />
        <span>We've sent you a verification email. (Please also check your spam folder)</span>
      </div>

    </div>
  )
}

export default SignInPage
