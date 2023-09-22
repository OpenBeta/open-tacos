import React, { useMemo } from 'react'

interface TinyHistogramProps {
  /** There is no hard limit for the lenght of this data,
     * but this is not a component optimized for large arrays
     * (and in any case is not appropriate for such a use).
     *
     * 4-6 is the recommended distribution resolution.
    */
  data: number[]
  /** Will be four by default, but if that needs to be overridden
   * then it can be done here.
   */
  verticalResolution?: number

  title?: string
}

function Column ({ val, vert }: { val: number, vert: number }): JSX.Element {
  const cells = Array(vert).fill(0).map((_, index) => {
    if (index < val) {
      return false
    }
    return true
  }).reverse()

  return (
    <div className='pr-1'>
      {cells.map((cell, index) => {
        if (cell) {
          return <div key={index} className='bg-gray-200  h-1 w-2 mt-0.5' />
        }
        return <div key={index} className='bg-gray-600 h-1 w-2 mt-0.5' />
      })}
    </div>
  )
}

/** Does what it says on the box. */
export default function TinyHistogram (props: TinyHistogramProps): JSX.Element {
  const verticalResolution = props.verticalResolution !== undefined ? props.verticalResolution : 4
  const data = useMemo(() => {
    const max = Math.max(...props.data)
    const normalized = props.data.map(val => {
      let x = (val / max) * verticalResolution
      if (x > 0 && x < 1) {
        x = 1
      } else {
        x = Math.round(x)
      }
      return x
    })
    return normalized
  }, [props.data])

  return (
    <div className='flex' title={props.title}>
      {data.map((i, index) => <Column key={index} val={i} vert={verticalResolution} />)}
    </div>
  )
}
