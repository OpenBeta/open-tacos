import classnames from 'classnames'
import { ReactElement, ReactFragment } from 'react'

interface BarProps {
  fixed?: boolean
  borderBottom?: boolean
  backgroundClass?: string
  layoutClass?: string
  heightClass?: string
  paddingX?: string
  zIndexClass?: string
  className?: string
  children: ReactElement | ReactFragment
}
export default function Bar ({
  fixed = false,
  borderBottom = false,
  className = '',
  zIndexClass = Bar.Z_DEFAULT,
  backgroundClass = Bar.BG_DEFAULT,
  heightClass = Bar.H_DEFAULT,
  layoutClass = Bar.JUSTIFY_BETWEEN,
  paddingX = Bar.PX_DEFAULT,
  children
}: BarProps): JSX.Element {
  return (
    <div className={
      classnames(
        fixed ? 'sticky top-0' : '',
        borderBottom ? 'drop-shadow' : '',
        zIndexClass,
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
Bar.Z_DEFAULT = 'z-10'
Bar.Z_HIGH = 'z-30'
Bar.H_DEFAULT = 'h-12 lg:h-16'
Bar.H_LG = 'h-16' /* Large screen */
Bar.BG_DEFAULT = 'bg-gray-50'
Bar.JUSTIFY_LEFT = 'flex no-wrap justify-start items-center'
Bar.JUSTIFY_RIGHT = 'flex no-wrap justify-end items-center'
Bar.JUSTIFY_BETWEEN = 'flex no-wrap justify-between items-center w-full'
Bar.PX_DEFAULT = 'px-4'
Bar.PX_DEFAULT_LG = 'px-4 lg:px-0'
