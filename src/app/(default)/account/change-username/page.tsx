import { Metadata } from 'next'

import { UsernameChangeForm } from '@/components/users/account/UsernameChangeForm'
import { AccountLayout } from '@/components/users/account/AccountLayout'

export const metadata: Metadata = {
  title: 'Change username'
}

export default function ChangeUsernamePage (): JSX.Element {
  return <AccountLayout form={<UsernameChangeForm />} />
}
