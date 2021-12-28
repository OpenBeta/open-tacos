import React from 'react'

function isIndexSelected (selected, index) {
  if (!Array.isArray(selected) && typeof selected !== 'number') {
    return false
  }

  if (Array.isArray(selected)) {
    return selected.includes(index)
  }

  return selected === index
}

export default function ButtonGroup ({
  onClick,
  selected,
  children,
  disabled,
  className
}) {
  function getBorderRadii (index) {
    return index === 0
      ? 'rounded-r-none'
      : index === children.length - 1
        ? 'rounded-l-none -ml-1'
        : 'rounded-none -ml-1'
  }

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return null
        }

        const isSelected = child.props.isSelected
          ? child.props.isSelected
          : isIndexSelected(selected, index)

        const borderRadiiOverride = getBorderRadii(index)
        const selectedOverride = isSelected ? 'bg-custom-primary' : ''

        return React.cloneElement(child, {
          disabled: disabled || child.props.disabled,
          active: isSelected,
          className: `${selectedOverride} ${borderRadiiOverride}`,
          onClick: (event) => {
            if (disabled) {
              return
            }

            if (child.props.onClick) {
              child.props.onClick(event)
            }

            if (onClick) {
              onClick(event, index)
            }
          }
        })
      })}
    </div>
  )
}
