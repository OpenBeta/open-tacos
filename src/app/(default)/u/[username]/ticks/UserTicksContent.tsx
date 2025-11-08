'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { TickType } from '@/js/types'
import ImportFromMtnProj from '@/components/users/ImportFromMtnProj'
import { ChartsSectionProps } from '@/components/logbook/ChartsSection'
import { CalendarIcon, TrophyIcon, ListBulletsIcon, RowsIcon } from '@phosphor-icons/react/dist/ssr'

interface UserTicksContentProps {
  username: string
  ticks: TickType[]
}

const INITIAL_COUNT = 20

export function UserTicksContent ({ username, ticks }: UserTicksContentProps): React.JSX.Element {
  const [showAll, setShowAll] = useState(false)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [filterStyle, setFilterStyle] = useState<string>('all')
  const [filterAttemptType, setFilterAttemptType] = useState<string>('all')

  const stats = useMemo(() => {
    if (ticks.length === 0) return null

    const uniqueStyles = new Set(ticks.map(t => t.style).filter(Boolean))
    const uniqueAttemptTypes = new Set(ticks.map(t => t.attemptType).filter(Boolean))
    const sortedByDate = [...ticks].sort((a, b) => b.dateClimbed - a.dateClimbed)
    const latestTick = sortedByDate[0]

    return {
      total: ticks.length,
      styles: Array.from(uniqueStyles),
      attemptTypes: Array.from(uniqueAttemptTypes),
      latestDate: latestTick != null ? new Date(latestTick.dateClimbed).toLocaleDateString() : null
    }
  }, [ticks])

  const filteredTicks = useMemo(() => {
    let filtered = [...ticks]

    if (filterStyle !== 'all') {
      filtered = filtered.filter(t => t.style === filterStyle)
    }

    if (filterAttemptType !== 'all') {
      filtered = filtered.filter(t => t.attemptType === filterAttemptType)
    }

    return filtered.sort((a, b) => b.dateClimbed - a.dateClimbed)
  }, [ticks, filterStyle, filterAttemptType])

  const displayedTicks = showAll ? filteredTicks : filteredTicks.slice(0, INITIAL_COUNT)

  return (
    <>
      {ticks?.length !== 0 && <ChartsSection tickList={ticks} />}

      <section className='max-w-screen-2xl mx-auto px-4 py-8 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>{username}'s Logbook</h1>
              {stats != null && (
                <div className='flex flex-wrap items-center gap-4 text-sm text-base-content/70'>
                  <div className='flex items-center gap-1.5'>
                    <TrophyIcon className='w-4 h-4' />
                    <span>{stats.total} total ticks</span>
                  </div>
                  {stats.latestDate != null && stats.latestDate !== '' && (
                    <div className='flex items-center gap-1.5'>
                      <CalendarIcon className='w-4 h-4' />
                      <span>Last tick: {stats.latestDate}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className='flex items-center gap-3'>
              <ImportFromMtnProj username={username} />
              <Link href={`/u/${username}`} className='btn btn-xs md:btn-sm btn-outline'>
                View Profile
              </Link>
            </div>
          </div>

          {/* Filters and View Toggle */}
          <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
            <div className='flex flex-wrap gap-2'>
              {stats != null && stats.styles.length > 1 && (
                <select
                  className='select select-sm select-bordered'
                  value={filterStyle}
                  onChange={(e) => setFilterStyle(e.target.value)}
                >
                  <option value='all'>All styles</option>
                  {stats.styles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              )}

              {stats != null && stats.attemptTypes.length > 1 && (
                <select
                  className='select select-sm select-bordered'
                  value={filterAttemptType}
                  onChange={(e) => setFilterAttemptType(e.target.value)}
                >
                  <option value='all'>All types</option>
                  {stats.attemptTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              )}

              {(filterStyle !== 'all' || filterAttemptType !== 'all') && (
                <button
                  className='btn btn-sm btn-ghost'
                  onClick={() => {
                    setFilterStyle('all')
                    setFilterAttemptType('all')
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className='btn-group'>
              <button
                className={`btn btn-sm ${viewMode === 'cards' ? 'btn-active' : 'btn-outline'}`}
                onClick={() => setViewMode('cards')}
                aria-label='Card view'
              >
                <ListBulletsIcon className='w-4 h-4' />
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'table' ? 'btn-active' : 'btn-outline'}`}
                onClick={() => setViewMode('table')}
                aria-label='Table view'
              >
                <RowsIcon className='w-4 h-4' />
              </button>
            </div>
          </div>

          {filteredTicks.length !== ticks.length && (
            <div className='mt-3 text-sm text-base-content/70'>
              Showing {filteredTicks.length} of {ticks.length} ticks
            </div>
          )}
        </div>

        {/* Content */}
        {ticks?.length > 0
          ? (
            <>
              {viewMode === 'cards'
                ? <CardsView ticks={displayedTicks} />
                : <TableView ticks={displayedTicks} />}

              {INITIAL_COUNT < filteredTicks.length && (
                <div className='flex justify-center mt-8'>
                  <button className='btn btn-primary' onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Show Less' : `Show All (${filteredTicks.length})`}
                  </button>
                </div>
              )}
            </>
            )
          : (
            <div className='text-center py-16'>
              <TrophyIcon className='w-16 h-16 mx-auto mb-4 text-base-content/20' />
              <h3 className='text-xl font-semibold mb-2'>No ticks yet</h3>
              <p className='text-base-content/70 mb-4'>Start logging your climbs to build your logbook</p>
              <ImportFromMtnProj username={username} />
            </div>
            )}
      </section>
    </>
  )
}

function CardsView ({ ticks }: { ticks: TickType[] }): React.JSX.Element {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {ticks.map((tick) => (
        <TickCard key={tick._id} tick={tick} />
      ))}
    </div>
  )
}

function TableView ({ ticks }: { ticks: TickType[] }): React.JSX.Element {
  return (
    <div className='overflow-x-auto'>
      <table className='table table-zebra'>
        <thead>
          <tr>
            <th>Climb</th>
            <th>Grade</th>
            <th className='hidden md:table-cell'>Style</th>
            <th className='hidden lg:table-cell'>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {ticks.map((tick) => (
            <TickRow key={tick._id} tick={tick} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TickCard ({ tick }: { tick: TickType }): React.JSX.Element {
  const { name, climbId, dateClimbed, grade, style, attemptType, notes } = tick

  return (
    <Link
      href={`/climb/${climbId}`}
      className='card bg-base-100 border border-base-300 hover:border-primary hover:shadow-lg transition-all'
    >
      <div className='card-body p-4'>
        <h3 className='card-title text-base font-semibold line-clamp-2'>{name}</h3>

        <div className='flex flex-wrap gap-2 my-2'>
          <div className='badge badge-lg badge-primary'>{grade}</div>
          {style != null && style !== '' && <div className='badge badge-outline'>{style}</div>}
          {attemptType != null && attemptType !== '' && <div className='badge badge-outline badge-success'>{attemptType}</div>}
        </div>

        {notes != null && notes !== '' && (
          <p className='text-sm text-base-content/70 line-clamp-2 mb-2'>{notes}</p>
        )}

        <div className='text-xs text-base-content/60 flex items-center gap-1'>
          <CalendarIcon className='w-3.5 h-3.5' />
          {new Date(dateClimbed).toLocaleDateString()}
        </div>
      </div>
    </Link>
  )
}

function TickRow ({ tick }: { tick: TickType }): React.JSX.Element {
  const { name, climbId, dateClimbed, grade, style, attemptType } = tick

  return (
    <tr className='hover'>
      <td>
        <Link href={`/climb/${climbId}`} className='link link-hover font-medium'>
          {name}
        </Link>
      </td>
      <td>
        <div className='badge badge-primary badge-sm'>{grade}</div>
      </td>
      <td className='hidden md:table-cell'>
        {style != null && style !== '' && <div className='badge badge-outline badge-sm'>{style}</div>}
      </td>
      <td className='hidden lg:table-cell'>
        {attemptType != null && attemptType !== '' && <div className='badge badge-success badge-outline badge-sm'>{attemptType}</div>}
      </td>
      <td className='text-sm text-base-content/70'>
        {new Date(dateClimbed).toLocaleDateString()}
      </td>
    </tr>
  )
}

const ChartsSection = dynamic<ChartsSectionProps>(
  async () =>
    await import('@/components/logbook/ChartsSection').then(
      module => module.default), { ssr: false }
)
