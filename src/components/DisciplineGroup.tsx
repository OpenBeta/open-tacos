import { useEffect } from 'react'
import { ClimbDisciplineRecord } from '../js/types'
import TableView from './ui/TableView'
import Toggle from './ui/Toggle'

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
    <TableView divider>
      <Toggle
        label='Sport'
        enabled={climbTypes.sport}
        onClick={() => {
          // eslint-disable-next-line
         setClimbTypes({ ...climbTypes, sport: !climbTypes.sport })
        }}
      />

      <Toggle
        enabled={climbTypes.trad}
        label='Trad'
        onClick={() => {
          // eslint-disable-next-line
          setClimbTypes({ ...climbTypes, trad: !climbTypes.trad })
        }}
      />
      <Toggle
        enabled={climbTypes.tr}
        label='Top rope'
        onClick={() => {
          // eslint-disable-next-line
          setClimbTypes({ ...climbTypes, tr: !climbTypes.tr })
        }}
      />
      <Toggle
        enabled={climbTypes.bouldering}
        label='Bouldering'
        onClick={() => {
          // eslint-disable-next-line
          setClimbTypes({ ...climbTypes, bouldering: !climbTypes.bouldering })
        }}
      />
    </TableView>
  )
}

export default DisciplineGroup
