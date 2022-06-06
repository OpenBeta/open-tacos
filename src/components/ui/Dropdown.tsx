import { useState } from 'react'
import { usePopper } from 'react-popper'
import { Menu } from '@headlessui/react'

export default function Dropdown ({ button, children }): JSX.Element {
  const [referenceElement, setReferenceElement] = useState<null | HTMLElement>(null)
  const [popperElement, setPopperElement] = useState<null | HTMLElement>(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 8]
      }
    }
    ],
    strategy: 'fixed'
  })
  return (
    <Menu as='div' className='relative text-left z-50'>
      <div ref={setReferenceElement}>
        <Menu.Button as='div'>
          {button}
        </Menu.Button>
      </div>
      <Menu.Items
        className='dropdown-item absolute w-48 rounded-md bg-white shadow-lg focus:outline-none overflow-clip text-sm'
        ref={setPopperElement} style={{ ...styles.popper }} {...attributes.popper}
      >
        {children}
      </Menu.Items>
    </Menu>
  )
}
