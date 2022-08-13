import { Button, ButtonVariant } from '../ui/BaseButton'

export default function DefaultView (): JSX.Element {
  return (
    <div className='max-w-lg px-4 pb-16 xl:py-24 mx-auto'>
      <div className='flex flex-col gap-y-8 items-center'>
        <div className='text-primary font-bold'>I want to add</div>
        <div className='flex flex-col items-center gap-y-2'>
          <Button
            label={<span className='px-8'>New area</span>}
            variant={ButtonVariant.SOLID_DEFAULT}
          />
          <div className='text-xs text-secondary'>New crag, boulder, or a well-known destination</div>
        </div>
        <div className='flex flex-col items-center gap-y-2'>
          <Button
            label={<span className='px-8'>New climb</span>}
            variant={ButtonVariant.SOLID_DEFAULT}
            disabled
          />
          <div className='text-xs text-secondary'>New climb or boulder problem (coming soon!)</div>
        </div>
        <div className='flex flex-col items-center gap-y-2'>
          <Button
            label='New country'
            variant={ButtonVariant.OUTLINED_DEFAULT}
          />
          <div className='text-xs text-secondary'>Less common</div>
        </div>
      </div>
    </div>
  )
}
