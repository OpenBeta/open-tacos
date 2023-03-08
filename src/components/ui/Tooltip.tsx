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
        <Popover.Content
          className='z-20 text-sm text-base-300 bg-tooltip rounded-md p-2 drop-shadow-lg border max-w-[300px] focus:outline-none'
          side='top'
          align='start'
          alignOffset={-40}
          collisionPadding={8}
        >
          {content}
          <Popover.Arrow className='stroke-tooltip fill-tooltip' />
        </Popover.Content>}
    </Popover.Root>
  )
}
