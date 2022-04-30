import { MiniCrumbs } from '../../ui/BreadCrumbs'

export const ClimbItem = (props): JSX.Element => {
  const { climbName, areaNames } = props.item.document
  return (<div className='my-4 text-xs'><MiniCrumbs pathTokens={areaNames} /><div>{climbName}</div></div>)
}

export const ClimbResultHeader = (props: any): JSX.Element => {
  // console.log('#Climb header', props)
  return (<div className='bg-pink-200'>Climb header</div>)
}
