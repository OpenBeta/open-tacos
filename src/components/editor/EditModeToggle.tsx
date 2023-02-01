import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import clx from 'classnames'
interface Props {
  onChange: Dispatch<SetStateAction<boolean>>
  showSkeleton?: boolean
}

export default function EditModeToggle ({ onChange, showSkeleton = false }: Props): JSX.Element {
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
    <label className={clx('inline-flex label', showSkeleton ? 'opacity-30' : 'opacity-100 cursor-pointer')}>
      <span className='label-text mr-2 text-md font-semibold'>Edit mode</span>
      <input
        type='checkbox' name='editMode' className='toggle toggle-accent md:toggle-lg' checked={editable} disabled={showSkeleton} onChange={onPressed}
      />
    </label>
  )
}
