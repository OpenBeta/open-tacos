interface SettingGroupProps {
  divider?: boolean
  children: React.ReactNode
  paddingClass?: string
}
export default function TableView ({ divider = false, paddingClass = '', children }: SettingGroupProps): JSX.Element {
  return (
    <div className='mt-6'>
      <div className={`${paddingClass} border-b border-gray-300 bg-gray-50 lg:border-0 lg:bg-inherit flex flex-col w-full max-w-screen-sm px-4 md:mx-auto md:rounded-md ${divider ? 'divide-y' : ''} lg:divide-y-0`}>
        {children}
      </div>
    </div>
  )
}

TableView.PADDING_MD = 'px-8 py-12'
