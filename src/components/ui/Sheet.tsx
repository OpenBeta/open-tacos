interface SheetProps {
  paddingClass?: string
  borderClass?: string
  children: React.ReactNode
}

export default function Sheet ({
  borderClass = Sheet.DEFAULT_BORDER,
  paddingClass = Sheet.DEFAULT_PADDING,
  children
}: SheetProps): JSX.Element {
  return (<div className={` ${borderClass} ${paddingClass}`}>{children}</div>)
}

Sheet.DEFAULT_BORDER = 'border-0'
Sheet.DEFAULT_PADDING = 'm-4 lg:m-6'
