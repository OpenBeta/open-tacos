import Slider, { SliderProps } from 'rc-slider'
import 'rc-slider/assets/index.css'

export interface RangeSliderProps {
  onChange: Function
}
const RangeSlider = (props: Partial<SliderProps>): JSX.Element => (
  <Slider
    range
    {...props}
    trackStyle={[{ backgroundColor: '#62cae3' }
    ]}
    activeDotStyle={{ borderColor: '#62cae3', backgroundColor: '#fafafa' }}
    railStyle={{ backgroundColor: 'rgb(71 85 105)' }} // bg-slate-600
    dotStyle={{ backgroundColor: 'rgb(148 163 184)', borderColor: 'rgb(148 163 184)' }}
  />
)

export default RangeSlider
