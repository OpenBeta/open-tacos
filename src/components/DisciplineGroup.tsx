import { useEffect } from 'react'
import { ClimbDisciplineRecord } from '../js/types'
import { FilterToggleButton } from './ui/Button'

interface DisciplineGroupProps {
  defaultTypes: Partial<ClimbDisciplineRecord>
  climbTypes: Partial<ClimbDisciplineRecord>
  setClimbTypes: Function
}

const DisciplineGroup = ({ climbTypes, setClimbTypes, defaultTypes }: DisciplineGroupProps): JSX.Element => {
  useEffect(() => { // if doesn't match, set everything to default
    if (JSON.stringify(climbTypes) !== JSON.stringify(defaultTypes)) {
      setClimbTypes({ ...defaultTypes })
    }
  }, [])

  return (
    <div className='flex space-x-2'>
      <FilterToggleButton
        selected={climbTypes.sport}
        label='Sport'
        onClick={() => {
          // eslint-disable-next-line
          setClimbTypes({ ...climbTypes, sport: !climbTypes.sport })
        }}
      />
      <FilterToggleButton
        selected={climbTypes.trad}
        label='Trad'
        onClick={() => {
          // eslint-disable-next-line
          setClimbTypes({ ...climbTypes, trad: !climbTypes.trad })
        }}
      />
      <FilterToggleButton
        selected={climbTypes.tr}
        label='Top rope'
        onClick={() => {
          // eslint-disable-next-line
          setClimbTypes({ ...climbTypes, tr: !climbTypes.tr })
        }}
      />
      <FilterToggleButton
        selected={climbTypes.bouldering}
        label='Bouldering'
        onClick={() => {
          // eslint-disable-next-line
          setClimbTypes({ ...climbTypes, bouldering: !climbTypes.bouldering })
        }}
      />
    </div>
  )
}

export default DisciplineGroup
