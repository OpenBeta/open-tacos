import * as Tabs from '@radix-ui/react-tabs'
import classNames from 'classnames'

export default function TabsTrigger ({ tabKey, activeKey, children }): JSX.Element {
  return (
    <Tabs.Trigger
      value={tabKey}
      className={classNames(tabKey === activeKey ? 'border-b-2 border-black' : '')}
    >
      {children}
    </Tabs.Trigger>
  )
}
