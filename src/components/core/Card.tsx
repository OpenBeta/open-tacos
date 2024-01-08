import clx from 'classnames'

/**
 * A simple card component.
 * @see https://daisyui.com/components/card/
 */
export const Card: React.FC<{ children: React.ReactNode, compact?: boolean, bordered?: boolean, className?: string }> =
  ({ compact = false, bordered: border = true, className = '', children }) => {
    return (
      <div className={
        clx(
          'card card-compact card-bordered border-base-300/50 overflow-hidden shadow-lg bg-base-100 w-80 max-h-[400px]',
          compact ? 'card-compact' : '',
          border ? 'card-bordered border-base-300/50 ' : '',
          className)
      }
      >
        <div className='card-body overflow-y-auto minimal-scrollbar'>
          {children}
        </div>
      </div>
    )
  }
