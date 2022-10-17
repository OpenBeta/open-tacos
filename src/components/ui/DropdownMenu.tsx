import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'
import clx from 'classnames'

interface DropdownMenuProps {
  children: JSX.Element[]
  align?: 'start' | 'center' | 'end'
}

/**
 * The main container to wrap dropdown menu items.
 * @param children One or more menu item.  See `DropdownItem`.
 */
export function DropdownContent ({ align = 'center', children }: DropdownMenuProps): JSX.Element {
  return (
    <DropdownPrimitive.Portal>
      <div className='fixed z-50 inset-0 h-screen w-screen bg-black/60'>
        <DropdownPrimitive.Content
          sideOffset={10}
          avoidCollisions align={align}
          className='rounded-box w-80 bg-base-100 shadow-xl px-2 py-2 text-sm'
        >
          {children}
        </DropdownPrimitive.Content>
      </div>
    </DropdownPrimitive.Portal>
  )
}

interface DropdownItemProps {
  icon?: JSX.Element
  text: string
  className?: string
  onSelect?: (event: Event) => void
  disabled?: boolean
}
/**
 * Individual menu item
 */
export const DropdownItem = ({ icon, text, onSelect, disabled = false, className = '' }: DropdownItemProps): JSX.Element => {
  return (
    <DropdownPrimitive.Item
      disabled={disabled}
      onSelect={onSelect}
      className={
        clx('outline-none select-none inline-flex items-center gap-x-2 hover:bg-secondary px-2 py-3 w-full rounded-btn ring-0',
          className,
          disabled ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
        )
      }
    >
      {icon == null ? <span className='w-5 h-5' /> : icon}<span>{text}</span>
    </DropdownPrimitive.Item>
  )
}

export const DropdownSeparator = (): JSX.Element => (
  <DropdownPrimitive.Separator asChild>
    <hr />
  </DropdownPrimitive.Separator>)

/**
 * A reuseable dropdown menu.  Anatomy:
 * ```
 * <DropdownMenu>
 *   <DropdownTrigger>Activate menu</DropdownTrigger>
 *   <DropdownContent>
 *     <DropdownItem text='Item 1'/>
 *     <DropdownItem text='Item 2'/>
 *     <DropdownSeparator />
 *     <DropdownItem text='Item 3'/>
 *   </DropdownContent>
 * </DropdownMenu>
 * ```
 */
export const DropdownMenu = DropdownPrimitive.Root

/**
 * A button used to activate the menu
 */
export const DropdownTrigger = DropdownPrimitive.Trigger
