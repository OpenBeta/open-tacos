import Link from 'next/link'

import forOwnerOnly from '../../js/auth/forOwnerOnly'

function EditProfileButton (): JSX.Element {
  return (
    <Link href='/account/editProfile'>
      <a className='btn btn-xs md:btn-sm btn-outline'>Edit profile
      </a>
    </Link>
  )
}

export default forOwnerOnly(EditProfileButton)
