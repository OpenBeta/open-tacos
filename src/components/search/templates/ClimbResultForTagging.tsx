import { MiniCrumbs } from '../../ui/BreadCrumbs'

export function MiniClimbItem (props): JSX.Element {
  const { climbName, areaNames } = props.item.document
  return (
    <div className=''>
      <div className='text-primary text-sm font-semibold'>{climbName}</div>
      <MiniCrumbs pathTokens={areaNames} />
    </div>
  )
}
