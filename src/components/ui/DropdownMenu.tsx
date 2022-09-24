import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'
import clx from 'classnames'

interface DropdownMenuProps {
  children: JSX.Element[]
}
export function DropdownContent ({ children }: DropdownMenuProps): JSX.Element {
  return (
    <DropdownPrimitive.Portal>
      <div className='absolute z-50 inset-0 h-screen w-screen bg-black/60'>
        <DropdownPrimitive.Content
          sideOffset={10}
          avoidCollisions align='start'
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
  value?: string
  onSelect?: (event: Event) => void
  disabled?: boolean
}
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

export const DropdownMenu = DropdownPrimitive.Root
export const DropdownTrigger = DropdownPrimitive.Trigger
