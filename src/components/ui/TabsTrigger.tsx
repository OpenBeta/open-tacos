import * as Tabs from '@radix-ui/react-tabs'
import classNames from 'classnames'

export default function TabsTrigger ({ tabKey, activeKey, children }): JSX.Element {
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
      {children}
    </Tabs.Trigger>
  )
}
