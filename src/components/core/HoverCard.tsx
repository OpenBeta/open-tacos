'use client'
import * as HoverCardBase from '@radix-ui/react-hover-card'

/**
 * Hover card component.  Use this judiciously as it's not mobile friendly.
 * @see https://radix-ui.com/primitives/docs/components/hover-card
 */
export const HoverCard: React.FC<{ content: React.ReactNode, children: React.ReactNode }> = ({ content, children }) => {
  return (
    <HoverCardBase.Root>
      <HoverCardBase.Trigger asChild>
        {children}
      </HoverCardBase.Trigger>
      <HoverCardBase.Portal>
        <HoverCardBase.Content align='start' className='z-50'>
          <HoverCardBase.Arrow className='fill-base-300/60' />
          {content}
        </HoverCardBase.Content>
      </HoverCardBase.Portal>
    </HoverCardBase.Root>
  )
}
