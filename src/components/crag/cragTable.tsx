import { getScoreForSort, GradeScales } from '@openbeta/sandbag'
import React, { useMemo, useState } from 'react'
import { Climb } from '../../js/types'
import { getSetTypes } from '../ui/RouteTypeChips'
import ButtonGroup from '../../components/ui/ButtonGroup'
import { Button } from '../../components/ui/Button'
import { summarize } from './cragSummary'

interface CragTableProps {
  climbs: Climb[]
  title?: string
}

/** curried redirect, including href in <tr> elements is illegal HTML */
function goTo (climbId: string) {
  return () => {
    window.location.href = `/climbs/${climbId}`
  }
}

interface CragSortType {
  value: string
  text: string
}

function sortRoutes (routes: Climb[], sortType: CragSortType): Climb[] {
  switch (sortType.value) {
    case 'leftToRight': {
      return routes.sort(
        (a, b) =>
          parseInt(a.metadata.left_right_index, 10) -
          parseInt(b.metadata.left_right_index, 10)
      )
    }
    case 'grade': {
      return routes.sort(
        (a, b) => getScoreForSort(a.yds, GradeScales.Yds) -
        getScoreForSort(b.yds, GradeScales.Yds)
      )
    }
    default:
      return routes
  }
}

function ClimbItem (props: {climb: Climb}): JSX.Element {
  const { name, yds, type, fa, metadata } = props.climb
  const [summary] = useMemo(() => summarize(props.climb.content.description, 50), [props.climb])

  return (
    <div
      className='text-black font-normal hover:bg-purple-100 cursor-pointer
        hover:ring-1 ring-purple-400 rounded-xl transition-colors duration-200
        text-sm sm:text-base hover:shadow-purple-500 hover:shadow w-full
        p-3 border-slate-700 border px-4 md:px-8 flex flex-col'
      data-href={`/climbs/${metadata.climbId}`}
      onClick={goTo(metadata.climbId)}
      title={`First assent: ${fa}`}
    >
      <div className='flex'>
        <div className='text-lg mt-2'>{name}</div>
        <div className='text-right flex-1'>Grade: {yds}</div>
      </div>

      <div className='w-full text-sm text-gray-600 mt-2 grow'>
        {summary}
      </div>

      <div className='text-sm mt-2'>
        Discipline(s): {getSetTypes(type).join(', ')}
      </div>
    </div>

  )
}

const climbSortByOptions: CragSortType[] = [
  { value: 'leftToRight', text: 'Left To Right' },
  { value: 'grade', text: 'Grade' }
]

export default function CragTable (props: CragTableProps): JSX.Element {
  // Index for one of climbSortByOptions
  const [selectedClimbSort, setSelectedClimbSort] = useState<number>(0)
  const sortedRoutes = useMemo(() =>
    sortRoutes([...props.climbs], climbSortByOptions[selectedClimbSort]), [props.climbs, selectedClimbSort])

  return (
    <>
      <div className='flex mb-4'>
        {props.title !== undefined ? <h2 className='text-2xl font-normal'>{props.title}</h2> : ''}

        <div className='text-right flex-1'>
          <ButtonGroup
            disabled={false}
            selected={[selectedClimbSort]}
            onClick={(_: never, index: number) => {
              setSelectedClimbSort(index)
            }}
            className='text-right'
          >
            {climbSortByOptions.map(({ text }, index) => {
              return (
                <Button
                  key={index}
                  label={text}
                  className={null}
                  onClick={null}
                />
              )
            })}
          </ButtonGroup>
        </div>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-2 fr-2'>
        {sortedRoutes.map(i => <ClimbItem key={i.id} climb={i} />)}
      </div>
    </>
  )
}
