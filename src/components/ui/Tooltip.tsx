import * as Popover from '@radix-ui/react-popover'
import { ReactNode, useState } from 'react'

interface Props {
  content: string | ReactNode
  enabled?: boolean
  children: JSX.Element | JSX.Element [] | null
  className?: string
  trigger?: 'click' | 'hover'
}

/**
 * A Tooltip that activates on mouse click or touch.
 * @param enabled false to disable tooltip but still render the trigger element
 * @param children Trigger element
 * @param trigger 'click' to activate on click, 'hover' to activate on hover. defaults to click
 */
export default function Tooltip ({ content, enabled = true, className = '', children, trigger = 'click' }: Props): JSX.Element {
  const [open, setOpen] = useState(false)
  const handleMouseEnter = (): void => { if (trigger === 'hover') { setOpen(true) } }
  const handleMouseLeave = (): void => { if (trigger === 'hover') { setOpen(false) } }

  return (
    <Popover.Root open={trigger === 'hover' ? open : undefined} onOpenChange={setOpen}>
      <Popover.Trigger className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </Popover.Trigger>
      {enabled &&
        <Content>
          {content}
        </Content>}
    </Popover.Root>
  )
}

export const ControlledTooltip: React.FC<{ open: boolean, content: React.ReactNode, children: React.ReactNode }> = ({ open, content, children }) => (
  <Popover.Root open={open}>
    <Popover.Trigger asChild>{children}</Popover.Trigger>
    <Content>
      {content}
    </Content>
  </Popover.Root>)

/**
 * Tooltip body
 */
const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Popover.Content
    className='z-20 text-sm text-secondary bg-tooltip rounded-btn p-2 drop-shadow-lg border max-w-[300px] focus:outline-none'
    side='top'
    align='start'
    collisionPadding={8}
  >
    {children}
    <Popover.Arrow className='stroke-tooltip fill-tooltip' />
  </Popover.Content>
)
