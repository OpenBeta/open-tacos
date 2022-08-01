import { getScoreForSort, GradeScales } from '@openbeta/sandbag'
import React, { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Climb } from '../../js/types'
import { getSetTypes } from '../ui/RouteTypeChips'
import ButtonGroup from '../../components/ui/ButtonGroup'
import { Button } from '../../components/ui/Button'
import { summarize } from './cragSummary'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useCanary } from '../../js/hooks'
import { APIFavouriteCollections } from '../../pages/api/user/fav'

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
        (a, b) =>
          getScoreForSort(a.yds, GradeScales.Yds) -
          getScoreForSort(b.yds, GradeScales.Yds)
      )
    }
    default:
      return routes
  }
}

function ClimbItem (props: { favs: string[], climb: Climb, hideSummary: boolean }): JSX.Element {
  const {
    climb: { name, yds, type, fa, metadata },
    hideSummary
  } = props
  const [summary] = useMemo(
    () => summarize(props.climb.content.description, 50),
    [props.climb]
  )

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

      {props.favs.includes(props.climb.metadata.climbId) && (
        <div className='text-xs w-7 h-7 absolute -mt-5 -ml-10 rounded-full bg-white border border-rose-500
        flex items-center justify-center shadow-rose-300 shadow'
        >
          <div className='pt-1'>
            ❤️
          </div>
        </div>
      )}

      <div className='flex items-center mt-2'>
        <div className='text-lg flex-1'> {name}</div>
        <div className='whitespace-nowrap'>Grade: {yds}</div>
      </div>

      {!hideSummary && (
        <div className='w-full text-sm text-gray-600 mt-2 grow'>{summary}</div>
      )}

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

const reorderFromDrag = (
  climbs: Climb[],
  startIndex: number,
  endIndex: number
): Climb[] => {
  const [removed] = climbs.splice(startIndex, 1)
  climbs.splice(endIndex, 0, removed)
  return climbs
}

export default function CragTable (props: CragTableProps): JSX.Element {
  // Index for one of climbSortByOptions
  const [selectedClimbSort, setSelectedClimbSort] = useState<number>(0)
  const [isEditing, setIsEditing] = useState(false)
  const [sortedRoutes, setSortedRoutes] = useState<Climb[]>([])
  const [favs, setFavs] = useState<string[]>([])
  const canary = useCanary()
  const { status } = useSession()

  useEffect(() => {
    fetch('/api/user/fav')
      .then(async (res) => await res.json())
      .then((collections: APIFavouriteCollections) => {
        const f = collections.climbCollections.favourites
        if (f !== undefined) {
          setFavs(f)
        }
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    setSortedRoutes(
      sortRoutes([...props.climbs], climbSortByOptions[selectedClimbSort])
    )
  }, [props.climbs, selectedClimbSort])

  const canChangeOrder =
    canary && status === 'authenticated' && selectedClimbSort === 0

  return (
    <>
      <div>
        <div className='flex mb-4'>
          {props.title !== undefined
            ? (
              <h2 className='text-2xl font-normal'>{props.title}</h2>
              )
            : (
                ''
              )}

          <div className='flex-1'>
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
        {canChangeOrder && (
          <div className='flex gap-2 m-1'>
            <Button
              label={isEditing ? 'Save Changes' : 'Edit Order'}
              className=''
              onClick={() => {
                if (isEditing) {
                  console.log('New order: ', sortedRoutes)
                }
                setIsEditing(!isEditing)
              }}
            />
            {isEditing && (
              <Button
                label='Cancel'
                className=''
                onClick={() => {
                  setSortedRoutes(
                    sortRoutes([...props.climbs], climbSortByOptions[0])
                  )
                  setIsEditing(false)
                }}
              />
            )}
          </div>
        )}
      </div>

      <DragDropContext
        onDragEnd={(result) =>
          setSortedRoutes(
            reorderFromDrag(
              sortedRoutes,
              result.source.index,
              result.destination?.index ?? 0
            )
          )}
      >
        <Droppable droppableId='cragTable'>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-1 lg:gap-3 ${
                isEditing ? '' : 'xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2'
              }  fr-2`}
            >
              {sortedRoutes.map((i, idx) => (
                <Draggable
                  isDragDisabled={!isEditing}
                  draggableId={i.id}
                  index={idx}
                  key={i.id}
                >
                  {(provided, snapshot) => (
                    <div
                      className={`m-1 ${
                        snapshot.isDragging ? 'bg-purple-100' : 'bg-white'
                      }`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ClimbItem favs={favs} hideSummary={isEditing} key={i.id} climb={i} />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}
