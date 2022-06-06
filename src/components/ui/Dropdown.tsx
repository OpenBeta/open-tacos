import { useState } from 'react'
import { usePopper } from 'react-popper'
import { Menu } from '@headlessui/react'

interface DropdownProps {
  button: JSX.Element
  activeClz?: string
  children: JSX.Element | JSX.Element []
}
export default function Dropdown ({ button, activeClz = '', children }: DropdownProps): JSX.Element {
  const [referenceElement, setReferenceElement] = useState<null | HTMLElement>(null)
  const [popperElement, setPopperElement] = useState<null | HTMLElement>(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
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
    <Menu as='div' className='relative text-left z-50'>{
      ({ open }) => (
        <>
          <div ref={setReferenceElement}>
            <Menu.Button as='div' className={open ? activeClz : ''}>
              {button}
            </Menu.Button>
          </div>
          <Menu.Items
            className='dropdown-item absolute w-48 rounded-md bg-white shadow-lg focus:outline-none overflow-clip text-sm'
            ref={setPopperElement} style={{ ...styles.popper }} {...attributes.popper}
          >
            {children}
          </Menu.Items>
        </>)
}
    </Menu>
  )
}
