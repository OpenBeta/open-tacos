import LeanPopover from './LeanPopver'

interface FilterPopoverProps {
  label: string
  header: string
  children: JSX.Element | JSX.Element[]
  onApply?: Function
  onCancel?: Function
  min?: string | number
  max?: string | number
}
/**
 * Base popover component for crag finder filter bar
 * @param FilterPopoverProps
 * @returns
 */
const FilterPopover = ({ label, header, children, onApply, onCancel, min, max }: FilterPopoverProps): JSX.Element => {
  return (
    <LeanPopover
      btnClz='border-2 rounded-2xl btn-small border-neutral-100 text-neutral-100 flex flex-row space-x-1.5 center-items'
      btnLabel={label}
    >
      <LeanPopover.ContentPanel
        className='relative max-w-screen-sm mt-2 bg-white rounded-md p-4 drop-shadow-md min-w-[400px]'
        onApply={onApply}
        onCancel={onCancel}
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
