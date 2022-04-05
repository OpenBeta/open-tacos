import LeanPopover from './LeanPopver'
import MobileFilterPopover from './MobileFilterPopover'
interface FilterPopoverProps {
  label: string
  header: string
  children: JSX.Element | JSX.Element[]
  onApply?: Function
  min?: string | number
  max?: string | number
  isMobile?: boolean
}
/**
 * Base popover component for crag finder filter bar
 * @param FilterPopoverProps
 * @returns
 */
const FilterPopover = ({ label, header, children, onApply, min, max, isMobile = true }: FilterPopoverProps): JSX.Element => {
  if (isMobile) {
    return (
      <MobileFilterPopover btnLabel={label} title={header} onApply={onApply}>
        <MobileFilterPopover.ContentPanel>
          <div className='px-4 max-w-screen-sm mx-auto'>
            {children}
            {min !== undefined && max !== undefined &&
              <div className='px-4 mt-12 flex justify-between text-sm'>
                <div className='flex flex-col items-center'>
                  <div className='text-secondary text-xs'>Min</div>
                  <div className='pt-1 text-primary border-t-2 border-slate-400'>{min}</div>
                </div>
                <div className='flex flex-col items-center'>
                  <div className='text-secondary text-xs'>Max</div>
                  <div className='pt-1 text-primary border-t-2 border-slate-400'>{max}</div>
                </div>
              </div>}
          </div>
        </MobileFilterPopover.ContentPanel>
      </MobileFilterPopover>
    )
  }
  return (
    <LeanPopover
      btnClz='border-2 rounded-2xl btn-small border-neutral-100 lg:text-neutral-100 flex flex-row space-x-1.5 center-items'
      btnLabel={label}
    >
      <LeanPopover.ContentPanel
        className='relative mt-0 lg:mt-2 p-4 bg-white lg:rounded-md lh:drop-shadow-md lg:min-w-[400px] w-full'
        onApply={onApply}
      >
        <header className='mb-16'>{header}</header>
        <div className='px-4'>{children}</div>
        {min !== undefined && max !== undefined &&
          <div className='px-4 mt-12 flex justify-between text-sm'>
            <div className='flex flex-col items-center'>
              <div className='text-secondary text-xs'>Min</div>
              <div className='pt-1 text-primary border-t-2 border-slate-400'>{min}</div>
            </div>
            <div className='flex flex-col items-center'>
              <div className='text-secondary text-xs'>Max</div>
              <div className='pt-1 text-primary border-t-2 border-slate-400'>{max}</div>
            </div>
          </div>}
      </LeanPopover.ContentPanel>
    </LeanPopover>
  )
}

export default FilterPopover
