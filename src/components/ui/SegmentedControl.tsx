import { Tab } from '@headlessui/react'

interface SegmentedControlProps {
  labels: string[]
  views: JSX.Element[]
}
export default function SegmentedControl ({ labels, views }: SegmentedControlProps): JSX.Element {
  return (
    <Tab.Group>
      <Tab.List className='pointer-events-auto flex justify-center'>
        {labels.map(label => <Label key={label} label={label} />)}
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>Content 1</Tab.Panel>
        <Tab.Panel>Content 2</Tab.Panel>
        <Tab.Panel>Content 3</Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}

const Label = ({ label }): JSX.Element => (
  <Tab className='border-2'>
    {({ selected }) => (
      <div
        className={
          selected ? 'font-medium underline decoration-2' : 'font-light text-gray-400 hover:text-ob-secondary'
        }
      >
        {label}
      </div>
    )}
  </Tab>)
