import { useEffect, useState } from 'react'
import { ClimbDisciplineRecord } from '../js/types'
import { FilterToggleButton } from './ui/Button'

interface DisciplineGroupProps {
  defaultTypes: Partial<ClimbDisciplineRecord>
  climbTypes: Partial<ClimbDisciplineRecord>
  onChange: Function
}

const DisciplineGroup = ({ climbTypes, onChange, defaultTypes }: DisciplineGroupProps): JSX.Element => {
  const [types, setTypes] = useState(defaultTypes)

  useEffect(() => {
    if (JSON.stringify(climbTypes) !== JSON.stringify(defaultTypes)) {
      onChange({ ...climbTypes, sport: types.sport, tr: types.tr, trad: types.trad, bouldering: types.bouldering })
    }
  }, [])
  return (
    <div className='flex space-x-2'>
      <FilterToggleButton
        selected={climbTypes.sport}
        label='Sport'
        // eslint-disable-next-line
        onClick={() => onChange({ ...types, sport: !types.sport })}
      />
      <FilterToggleButton
        selected={climbTypes.trad}
        label='Trad'
        onClick={() => {
          // eslint-disable-next-line
          onChange({ ...climbTypes, trad: !types.trad })
        }}
      />
      <FilterToggleButton
        selected={climbTypes.tr}
        label='Top rope'
        onClick={() => {
          // eslint-disable-next-line
          onChange({ ...climbTypes, tr: !types.tr })
        }}
      />
      <FilterToggleButton
        selected={climbTypes.bouldering}
        label='Bouldering'
        onClick={() => {
          // eslint-disable-next-line
          onChange({ ...climbTypes, bouldering: !types.bouldering })
        }}
      />
    </div>
  )
}

export default DisciplineGroup
