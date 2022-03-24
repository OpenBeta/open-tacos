import LeanPopover from './LeanPopver'

interface FilterPopoverProps {
  label: string
  header: string
  children: JSX.Element | JSX.Element[]
  onApply: Function
  min: string | number
  max: string | number
}
/**
 * Base popover component for crag finder filter bar
 * @param FilterPopoverProps
 * @returns
 */
const FilterPopover = ({ label, header, children, onApply, min, max }: FilterPopoverProps): JSX.Element => {
  return (
    <LeanPopover
      btnClz='border-2 rounded-2xl btn-small border-neutral-100 text-neutral-100 flex flex-row space-x-1.5 center-items'
      btnLabel={label}
    >
      <LeanPopover.ContentPanel
        className='relative w-full max-w-screen-sm mt-2 bg-white rounded-md p-4 drop-shadow-md'
        onApply={onApply}
      >
        <header className='mb-16'>{header}</header>
        <div className='px-4'>{children}</div>
        {min !== undefined && max !== undefined &&
          <div className='mt-8 flex justify-between text-sm'>
            <div>{min}</div>
            <div>{max}</div>
          </div>}
      </LeanPopover.ContentPanel>
    </LeanPopover>
  )
}

export default FilterPopover
