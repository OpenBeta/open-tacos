import RangeSlider from './RangeSlider'
import { BOULDER_DEFS, genSliderMarks } from '../../js/grades/ranges'

export { BOULDER_DEFS }

const BoulderRangeSlider: React.FC<any> = ({ onChange, defaultValue }) => {
  return (
    <RangeSlider
      count={1}
      step={1}
      dots
      marks={genSliderMarks(BOULDER_DEFS, 'boulderRange')}
      min={0}
      max={14}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  )
}
export default BoulderRangeSlider
