import { getScoreForSort, GradeScales } from '@openbeta/sandbag'
import React, { useMemo, useState } from 'react'
import { Climb } from '../../js/types'
import { getSetTypes } from '../ui/RouteTypeChips'
import ButtonGroup from '../../components/ui/ButtonGroup'
import { Button } from '../../components/ui/Button'

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

function ClimbRow (props: {climb: Climb}): JSX.Element {
  const { name, yds, type, fa, metadata } = props.climb
  const baseClass = 'border-slate-800 border-t border-b p-2 sm:p-4'

  return (
    <tr
      className='text-black font-normal hover:bg-purple-100 cursor-pointer
    hover:ring-1 ring-purple-400 rounded-xl transition-colors duration-200
    text-sm sm:text-base hover:shadow-purple-500 hover:shadow'
      data-href={`/climbs/${metadata.climbId}`}
      onClick={goTo(metadata.climbId)}
      title={`First assent: ${fa}`}
    >
      <td className={`${baseClass} border-l rounded-l-xl pl-4 md:pl-8`}>{name}</td>
      <td className={`${baseClass}`}>
        {getSetTypes(type).join(', ')}
      </td>
      <td className={`${baseClass} border-r rounded-r-xl`}>{yds}</td>
    </tr>

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
            onClick={(_, index) => {
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

      <table
        className='w-full'
        style={{
          borderSpacing: '0px 10px',
          borderCollapse: 'separate'
        }}
      >
        <thead>
          <tr
            className='text-left text-slate-700 tracking-wide font-thin'
          >
            <th className='pl-8'>Name</th>
            <th className='px-4'>Discipline</th>
            <th className='px-4'> Grade</th>
          </tr>
        </thead>

        <tbody>
          {sortedRoutes.map((climb: Climb) => <ClimbRow climb={climb} key={climb.id} />)}
        </tbody>
      </table>

    </>
  )
}
