import SegmentedControl from '../ui/SegmentedControl'

interface MobileMainViewProps {
  listView: JSX.Element | JSX.Element[]
  mapView: JSX.Element | JSX.Element[]
}
export default function MobileMainView ({ listView, mapView }: MobileMainViewProps): JSX.Element {
  return (
    <SegmentedControl
      labels={['Map', 'List']}
    >
      <SegmentedControl.Segment>
        {mapView}
      </SegmentedControl.Segment>
      <SegmentedControl.Segment>
        {listView}
      </SegmentedControl.Segment>
    </SegmentedControl>
  )
}
