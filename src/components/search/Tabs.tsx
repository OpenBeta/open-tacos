import { Tab } from '@headlessui/react'

interface TabsProps {
  labels: string[]
  panelCompList: JSX.Element[]
}

const Tabs = ({ labels, panelCompList }: TabsProps): JSX.Element => {
  return (
    <Tab.Group>
      <Tab.List className='w-full flex justify-center pb-4 space-x-4 lg:space-x-8'>
        {labels.map(label => <TabLabel key={label} label={label} />)}
      </Tab.List>
      <Tab.Panels className='z-50'>
        {panelCompList.map(panel => (<Tab.Panel className='z-50' key={panel.key}>{panel}</Tab.Panel>))}
      </Tab.Panels>
    </Tab.Group>
  )
}

const TabLabel = ({ label }): JSX.Element => (
  <Tab className='z-50 text-lg text-white underline-offset-8'>
    {({ selected }) => (
      <div
        className={
        selected ? 'font-medium underline decoration-2' : 'font-light text-gray-400 hover:text-ob-tertiary'
      }
      >
        {label}
      </div>
    )}
  </Tab>)

export default Tabs
