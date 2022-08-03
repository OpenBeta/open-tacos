import { useState } from 'react'

interface ImportFromMtnProjProps {
  modal?: boolean
}

// regex: ^\d{9}\/ -- matches the first 9 digits and a slash

function ImportFromMtnProj ({ modal }: ImportFromMtnProjProps): JSX.Element | null {
  const [mpUID, setMPUID] = useState('')

  async function getTicks (): Promise<void> {
    // get the ticks and add it to the users metadata
    // need regex to verify mtn project ID
    const ret = await fetch('/api/user/ticks', {
      method: 'PUT',
      body: JSON.stringify(mpUID)
    })
    console.log(ret)
    if (ret.status === 200) {
      // do the fetch from mtn project and store that data in the Auth0 metadata
    } else {
      console.log(ret)
    }
  }

  return (
  // if the modal prop is true we want to render this component as a notification/modal
  // otherwise we want it to be a button
    <>
      <input
        value={mpUID}
        onChange={(e) => setMPUID(e.target.value)}
        className='border-2 border-black'
      />
      <button
        className='inline-flex space-x-2 items-center cursor-pointer disabled:cursor-auto disabled:opacity-50 border  border-gray-600 rounded-md bg-ob-primary text-white drop-shadow-md hover:ring-2 px-2.5 py-1 text-base'
        onClick={getTicks}
      />
    </>
  )
}

export default ImportFromMtnProj
