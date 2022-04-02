import { ClimbDisciplineRecord } from '../js/types'
import { FilterToggleButton } from './ui/Button'

interface DisciplineGroupProps {
  climbTypes: Partial<ClimbDisciplineRecord>
  onChange: Function
}

const DisciplineGroup = ({ climbTypes, onChange }: DisciplineGroupProps): JSX.Element => {
  return (
    <div className='flex space-x-2'>
      <FilterToggleButton
        selected={climbTypes.sport}
        label='Sport'
        // eslint-disable-next-line
        onClick={() => onChange({ ...climbTypes, sport: !climbTypes.sport })}
      />
      <FilterToggleButton
        selected={climbTypes.trad}
        label='Trad'
        onClick={() => {
          // eslint-disable-next-line
          onChange({ ...climbTypes, trad: !climbTypes.trad })
        }}
      />
      <FilterToggleButton
        selected={climbTypes.tr}
        label='Top rope'
        onClick={() => {
          // eslint-disable-next-line
          onChange({ ...climbTypes, tr: !climbTypes.tr })
        }}
      />
      <FilterToggleButton
        selected={climbTypes.bouldering}
        label='Bouldering'
        onClick={() => {
          // eslint-disable-next-line
          onChange({ ...climbTypes, boulder: !climbTypes.bouldering })
        }}
      />
    </div>
  )
}

export default DisciplineGroup
