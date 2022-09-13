import * as Tabs from '@radix-ui/react-tabs'
import classNames from 'classnames'

interface TabsTriggerProps {
  tabKey: string
  activeKey: string
  icon: JSX.Element
  label: string
  hidden?: boolean
}
export default function TabsTrigger ({ tabKey, activeKey, icon, label, hidden = false }: TabsTriggerProps): JSX.Element {
  return (
    <Tabs.Trigger
      value={tabKey}
      className={
        classNames(
          hidden ? 'hidden' : 'block relative z-50 border-b-4 w-20',
          tabKey === activeKey
            ? 'border-gray-800 text-base-content'
            : 'border-transparent hover:border-gray-400 text-base-300 hover:text-base-content')
      }
    >
      <div className='flex flex-col justify-center items-center'>
        <div>{icon}</div>
        <div className='no-underline my-2 text-xs font-semibold'>{label}</div>
      </div>
    </Tabs.Trigger>
  )
}
