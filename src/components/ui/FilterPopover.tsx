import LeanPopover, { ContentPanel } from './LeanPopver'
import MobileFilterPopover, { MobileContentPanel } from './MobileFilterPopover'
interface FilterPopoverProps {
  label: string
  shortHeader: string
  header: string
  children: JSX.Element | JSX.Element[]
  onApply?: Function
  minMax?: JSX.Element
  isMobile?: boolean
  mobileLabel?: JSX.Element | string
}
/**
 * Base popover component for crag finder filter bar
 * @param FilterPopoverProps
 * @returns
 */
export default function FilterPopover ({ label, mobileLabel, header, shortHeader, children, onApply, minMax, isMobile = true }: FilterPopoverProps): JSX.Element {
  if (isMobile) {
    return (
      <MobileFilterPopover mobileLabel={mobileLabel} btnLabel={label} title={shortHeader} onApply={onApply}>
        <MobileContentPanel>
          {minMax}
          {children}
        </MobileContentPanel>
      </MobileFilterPopover>
    )
  }
  return (
    <LeanPopover
      btnClz='border-2 rounded-2xl whitespace-nowrap py-1 px-4 border-primary-contrast lg:text-primary-contrast flex flex-row space-x-1.5 items-center'
      btnLabel={label}
    >
      <ContentPanel
        className='relative mt-2 p-6 bg-white rounded-md lg:drop-shadow-md lg:min-w-[400px] w-full'
        onApply={onApply}
      >
        <header className='mb-8'>{header}</header>
        <div className=''>{children}</div>
        {minMax}
      </ContentPanel>
    </LeanPopover>
  )
}

interface MinMaxProps {
  min: string
  max: string
}

export const MinMax = ({ min, max }: MinMaxProps): JSX.Element => {
  return (
    <div className='mt-6 max-w-screen-sm px-4 mx-auto flex justify-between text-sm'>
      <div className='flex flex-col items-center'>
        <div className='text-secondary text-xs'>Min</div>
        <div className='pt-1 text-primary border-t-2 border-slate-400'>{min}</div>
      </div>
      <div className='flex flex-col items-center'>
        <div className='text-secondary text-xs'>Max</div>
        <div className='pt-1 text-primary border-t-2 border-slate-400'>{max}</div>
      </div>
    </div>
  )
}
