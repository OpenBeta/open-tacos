import { Metadata } from 'next'

import { UpdateProfileForm } from '@/components/users/account/UpdateProfileForm'
import { AccountLayout } from '@/components/users/account/AccountLayout'

export const metadata: Metadata = {
  title: 'Edit profile'
}

export default function EditProfilePage (): JSX.Element {
  return <AccountLayout form={<UpdateProfileForm />} />
}
