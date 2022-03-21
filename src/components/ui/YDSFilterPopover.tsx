import YDSRangeSlider from './YDSRangeSlider'
import MyPopover from './Popover'

const YDSFilterPopover = (props): JSX.Element => {
  return (
    <div className='max-w-md w-full text-white'>
      <MyPopover label='YDS'>
        <YDSRangeSlider />
        <div className='flex justify-between'><div>low</div><div>high</div></div>
      </MyPopover>
    </div>
  )
}
export default YDSFilterPopover
