import RangeSlider from './RangeSlider'
import { YDS_DEFS, genSliderMarks } from '../../js/grades/ranges'

export { YDS_DEFS }

const YDSRangeSlider: React.FC<any> = ({ onChange, defaultValue }) => {
  return (
    <RangeSlider
      count={1}
      step={1}
      dots
      marks={genSliderMarks(YDS_DEFS, 'freeRange')}
      min={0}
      max={13}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  )
}
export default YDSRangeSlider
