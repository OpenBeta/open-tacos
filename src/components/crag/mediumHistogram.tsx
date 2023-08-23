import React, { useMemo } from 'react'

interface MediumHistogramProps {
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

  columnLabels?: string[]
}

function Column ({ val, vert, label }: { val: number, vert: number, label?: string }): JSX.Element {
  const cells = Array(vert).fill(0).map((_, index) => {
    if (index < val) {
      return false
    }
    return true
  }).reverse()

  return (
    <div className='items-center flex flex-col flex-grow text-center px-2'>
      {cells.map((cell, index) => {
        if (cell) {
          return <div key={index} className='bg-slate-200 grow w-8 mt-1' />
        }
        return <div key={index} className='bg-slate-700 grow w-8 mt-1' />
      })}
      <div style={{ fontSize: '0.6rem' }} className=' text-slate-700 hidden md:block'>
        {label}
      </div>
    </div>
  )
}

/** Does what it says on the box. */
export default function MediumHistogram (props: MediumHistogramProps): JSX.Element {
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

  const labels = (props.columnLabels !== undefined ? props.columnLabels : [])

  return (
    <div className='flex h-full flex-grow' title={props.title}>
      {data.map((i, index) => <Column label={labels[index]} key={index} val={i} vert={verticalResolution} />)}
    </div>
  )
}
