import * as React from 'react'
import { useRef } from 'react'
import { ListItemEntity } from './listItem'
import { PanelHeader, PanelHeaderProps } from './panelHeader'
import PanelList from './panelList'
import PanelOverview from './panelOverview'

interface SidePanelProps extends PanelHeaderProps {
  /**
     * If an item is focused (not clicked / selected) this must reflect the ID
     * of that entity (so that the feedback to the user is consistent).
     * null indicates no element is focused, it is not an invitation to treat as optional
     */
  focused: string | null
  /** If an item is selected, the user has asserted their intention to recieve more
   * information on the selected entity (Whatever it may be) so children must change
   * their visual state accordingly.
   * null indicates no element is selected, it is not an invitation to treat as optional
   */
  selected: string | null

  /**
   * This is what the list expects in order to display and interact with the entities
   * you wish to list here.
   */
  items: ListItemEntity[]

  /**
   * Focusing and selecting are distinct, but both require the parent component to
   * store this state.
   */
  onFocus: (id: string | null) => void

  /**
   * Focusing and selecting are distinct, but both require the parent component to
   * store this state.
   */
  onSelect: (id: string | null) => void
}

/** In the view spec for viewing and exploring conforming geo-entities
 * there is a left side panel containing the expounded data that is shown
 * on the expandable map on the right. This will be a recognizable map usage
 * for anyone that has seen google maps.
 */
export default function SidePanel (props: SidePanelProps): JSX.Element {
  const heroRef = useRef<HTMLDivElement>(null)
  let allowableListHeight = 400
  if (heroRef.current !== undefined && heroRef.current !== null) {
    allowableListHeight = heroRef.current.clientHeight
  }

  return (
    <div>
      <div ref={heroRef}>
        <PanelHeader
          title={props.title}
          description={props.description}
          latitude={props.latitude}
          longitude={props.longitude}
        />

        <PanelOverview
          items={props.items}
          onFocus={props.onFocus}
          onSelect={props.onSelect}
          selected={props.selected}
          focused={props.focused}
        />
      </div>

      <div
        style={{ maxHeight: `calc(85vh - ${allowableListHeight}px)` }}
        className='overflow-y-auto mt-8'
      >
        <PanelList
          onFocus={props.onFocus}
          onSelect={props.onSelect}
          items={props.items}
          focused={props.focused}
          selected={props.selected}
        />
      </div>
    </div>
  )
}
