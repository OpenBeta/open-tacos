import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
interface Props {
  onChange: Dispatch<SetStateAction<boolean>>
}

export default function EditModeToggle ({ onChange }: Props): JSX.Element {
  const [editable, setEditable] = useState(false)
  const session = useSession()

  useEffect(() => {
    if (session.status === 'unauthenticated' && editable) {
      void signIn('auth0') // send users to Auth0 login screen
    }
  }, [session, editable])

  useEffect(() => {
    const val = sessionStorage.getItem('editMode') === 'true'
    setEditable(val)
    onChange(val)
  }, [onChange])

  const onPressed = (): void => {
    onChange(curr => !curr)
    setEditable(curr => {
      sessionStorage.setItem('editMode', (!curr).toString())
      return !curr
    })
  }

  return (
    <form className='block'>
      <label className='inline-flex label cursor-pointer'>
        <span className='label-text mr-2 text-md font-semibold'>Edit mode</span>
        <input
          type='checkbox' name='editMode' className='toggle toggle-accent md:toggle-lg' checked={editable} onChange={onPressed}
        />
      </label>
    </form>
  )
}
