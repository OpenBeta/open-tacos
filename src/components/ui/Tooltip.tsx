import * as Popover from '@radix-ui/react-popover'

interface Props {
  content: string
  children: JSX.Element | JSX.Element []
}

export default function Tooltip ({ content, children }: Props): JSX.Element {
  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content
        className='z-20 bg-yellow-100 rounded-md p-2 drop-shadow-lg border max-w-xs focus:outline-none'
        side='top'
        align='start'
        alignOffset={-40}
      >
        {content}
        <Popover.Arrow className='stroke-yellow-100 fill-yellow-100' />
      </Popover.Content>
    </Popover.Root>
  )
}
