import * as Popover from '@radix-ui/react-popover'
import { ReactNode } from 'react'

interface Props {
  content: string | ReactNode
  enabled?: boolean
  hover?: boolean
  children: JSX.Element | JSX.Element[] | null
  className?: string
  defaultOpen?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
}

/**
 * Tooltip component displays a tooltip with custom content and positioning.
 * @param enabled `false` to disable tooltip but still render the trigger element
 * @param children Trigger element
 * @param defaultOpen `true` to open tooltip by default
 * @param side "top" | "right" | "bottom" | "left" - where to place the tooltip relative to the trigger element
 */
export default function Tooltip ({ content, side = 'top', enabled = true, defaultOpen = false, className = '', children }: Props): JSX.Element {
  return (
    <Popover.Root defaultOpen={defaultOpen}>
      <Popover.Trigger className={className}>{children}</Popover.Trigger>
      {enabled && (
        <Popover.Content
          className='z-20 text-sm text-base-300 bg-tooltip rounded-md p-2 drop-shadow-lg border max-w-[300px] focus:outline-none'
          side={side}
          align='start'
          alignOffset={-40}
          collisionPadding={8}
        >
          {content}
          <Popover.Arrow className='stroke-tooltip fill-tooltip' />
        </Popover.Content>
      )}
    </Popover.Root>
  )
}
