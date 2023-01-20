import * as Popover from '@radix-ui/react-popover'

interface Props {
  content: string
  disabled?: boolean
  children: JSX.Element | JSX.Element []
}

export default function Tooltip ({ content, disabled = false, children }: Props): JSX.Element {
  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      {disabled &&
        <Popover.Content
          className='z-20 bg-tooltip rounded-md p-2 drop-shadow-lg border max-w-[300px] focus:outline-none'
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
