import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
interface Props {
  name: string
  onChange: Dispatch<SetStateAction<boolean>>
}

export default function LockToggle ({ name, onChange }: Props): JSX.Element {
  const [editable, setEditable] = useState(false)
  const session = useSession()

  useEffect(() => {
    if (session.status === 'unauthenticated' && editable) {
      void signIn('auth0') // send users to Auth0 login screen
    }
  }, [session, editable])

  useEffect(() => {
    const val = sessionStorage.getItem(`toggle-${name}`) === 'true'
    setEditable(val)
    onChange(val)
  }, [onChange])

  const onPressed = (): void => {
    onChange(curr => !curr)
    setEditable(curr => {
      sessionStorage.setItem(`toggle-${name}`, (!curr).toString())
      return !curr
    })
  }

  return (
    <form>
      <label className='label cursor-pointer'>
        <span className='label-text mr-2 text-xs'>Edit mode</span>
        <input
          type='checkbox' name='editMode' className='toggle toggle-sm toggle-accent' checked={editable} onChange={onPressed}
        />
      </label>
    </form>
  )
}
