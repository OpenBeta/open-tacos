import * as Tabs from '@radix-ui/react-tabs'
import classNames from 'classnames'

export default function TabsTrigger ({ tabKey, activeKey, icon, label }): JSX.Element {
  return (
    <Tabs.Trigger
      value={tabKey}
      className={
        classNames('relative z-50 border-b-4 w-20',
          tabKey === activeKey
            ? 'border-gray-800 text-black'
            : 'border-transparent hover:border-gray-400 text-secondary hover:text-black')
      }
    >
      <div className='flex flex-col justify-center items-center'>
        <div>{icon}</div>
        <div className='no-underline my-2 text-xs font-semibold'>{label}</div>
      </div>
    </Tabs.Trigger>
  )
}
