import { Tab } from '@headlessui/react'

interface TabsProps {
  labels: string[]
  panelCompList: JSX.Element[]
}

const Tabs = ({ labels, panelCompList }: TabsProps): JSX.Element => {
  return (
    <Tab.Group>
      <Tab.List className='pointer-events-auto flex justify-center pb-3 space-x-4 lg:space-x-8'>
        {labels.map(label => <TabLabel key={label} label={label} />)}
      </Tab.List>
      <Tab.Panels className='left-0 absolute pointer-events-auto w-full'>
        {panelCompList.map(panel => (<Tab.Panel className='w-full' key={panel.key}>{panel}</Tab.Panel>))}
      </Tab.Panels>
    </Tab.Group>
  )
}

const TabLabel: React.FC<{ label: string }> = ({ label }) => (
  <Tab className='text-lg text-white underline-offset-8'>
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

export default Tabs
