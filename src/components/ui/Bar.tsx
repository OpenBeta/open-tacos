import classnames from 'classnames'

interface BarProps {
  backgroundClass?: string
  layoutClass?: string
  heightClass?: string
  paddingX?: string
  className?: string
  children: JSX.Element|JSX.Element[]
}
export default function Bar ({
  className = '',
  backgroundClass = Bar.BG_DEFAULT,
  heightClass = Bar.H_DEFAULT,
  layoutClass = 'flex justify-between items-center',
  paddingX = Bar.PX_DEFAULT,
  children
}: BarProps): JSX.Element {
  return (
    <div className={
      classnames(
        heightClass,
        layoutClass,
        backgroundClass,
        paddingX,
        className
      )
}
    >
      {children}
    </div>
  )
}

Bar.H_DEFAULT = 'h-12'
Bar.H_LG = 'h-16' /* Large screen */
Bar.BG_DEFAULT = 'bg-slate-200'
Bar.JUSTIFY_LEFT = 'flex justify-start items-center max-w-screen-2xl'
Bar.PX_DEFAULT = 'px-4'
