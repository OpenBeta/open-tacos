import { Tab } from '@headlessui/react'
import classname from 'classnames'
interface SegmentedControlProps {
  labels: string[]
  children: JSX.Element | JSX.Element[]
}
export default function SegmentedControl ({ labels, children }: SegmentedControlProps): JSX.Element {
  return (
    <Tab.Group>
      <Tab.List className='z-10 mx-auto border rounded-md overflow-hidden shadow-inner bg-gray-300 text-sm my-4'>
        {labels.map(label => <Label key={label} label={label} />)}
      </Tab.List>
      <Tab.Panels>
        {children}
      </Tab.Panels>
    </Tab.Group>
  )
}

export interface SegmentProps {
  children: any
}
const Segment = ({ children }: SegmentProps): JSX.Element => {
  return (<Tab.Panel>{children}</Tab.Panel>)
}

SegmentedControl.Segment = Segment

const Label = ({ label }): JSX.Element => (
  <Tab className='p-0.5'>
    {({ selected }) => (
      <div
        className={classname(
          'px-6 py-0.5 rounded',
          selected ? 'bg-white font-medium text-primary' : 'font-light text-secondary'
        )}
      >
        {label}
      </div>
    )}
  </Tab>)
