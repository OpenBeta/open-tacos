import * as Popover from '@radix-ui/react-popover'
import { ReactNode } from 'react'

interface Props {
  content: string | ReactNode
  enabled?: boolean
  children: JSX.Element | JSX.Element [] | null
  className?: string
}

/**
 * A Tooltip that activates on mouse click or touch.
 * @param enabled false to disable tooltip but still render the trigger element
 * @param children Trigger element
 */
export default function Tooltip ({ content, enabled = true, className = '', children }: Props): JSX.Element {
  return (
    <Popover.Root>
      <Popover.Trigger className={className}>{children}</Popover.Trigger>
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
