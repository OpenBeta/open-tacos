'use client'
import { useEffect, useState, FC, ReactNode } from 'react'
import clx from 'classnames'
import { PlusSquare } from '@phosphor-icons/react/dist/ssr'

import { getChildAreasForBreadcrumbs } from '@/js/graphql/getArea'
import { makeUrl } from './AreaCrumbs'
import { Card } from '@/components/core/Card'
import { HoverCard } from '@/components/core/HoverCard'
import { SiblingArea } from '@/js/graphql/gql/breadcrumbs'
import { areaLeftRightIndexComparator } from '@/js/utils'

interface Props {
  editMode: boolean
  pathTokens: string[]
  ancestors: string[]
  currentIndex: number
  children: ReactNode
}

/**
 * A area bread crumb component that shows the siblings of the current area on hover (desktop only).
 */
export const SiblingAreasCrumb: FC<Props> = ({ editMode, pathTokens, ancestors, currentIndex, children }) => {
  return (
    <HoverCard content={
      <Card compact bordered>
        <SiblingAreaContentPanel editMode={editMode} pathTokens={pathTokens} ancestors={ancestors} currentIndex={currentIndex} />
      </Card>
    }
    >
      {children}
    </HoverCard>
  )
}

const SiblingAreaContentPanel: FC<Omit<Props, 'children'>> = ({ editMode, pathTokens, ancestors, currentIndex }) => {
  const [siblings, setSiblings] = useState<SiblingArea[]>([])
  const [loading, setLoading] = useState(true)

  let parentUuid: string | null

  if (currentIndex === 0) {
    parentUuid = null
  } else {
    parentUuid = ancestors[currentIndex - 1]
  }

  const currentUuid = ancestors[currentIndex]

  useEffect(() => {
    if (parentUuid == null) {
      setSiblings([])
      return
    }
    setLoading(true)
    getChildAreasForBreadcrumbs(parentUuid, 'cache-first').then((data) => {
      setLoading(false)
      const children = data.children
      setSiblings(children)
    }).finally(() => {
      setLoading(false)
    })
  }, [currentIndex])

  return parentUuid == null
    ? (
      <p>Please use the search box to switch country</p>
      )
    : (
      <ul>
        {loading
          ? (
            <li className='text-sm w-full bg-base-200 h-32 flex items-center justify-center rounded-btn animate-pulse' />
            )
          : (
            <>
              {[...siblings].sort(areaLeftRightIndexComparator).map((sibling) => (
                <SiblingAreaItem key={sibling.uuid} area={sibling} highlight={sibling.uuid === currentUuid} editMode={editMode} />
              ))}
              <li>
                <a
                  href={`/editArea/${parentUuid}/general#addArea`}
                  target='_blank'
                  className='px-1 mt-1 text-accent font-semibold text-xs flex gap-1 items-center'
                  rel='noreferrer'
                >
                  <PlusSquare /> New areas
                </a>
              </li>
            </>
            )}
      </ul>
      )
}

const SiblingAreaItem: FC<{ area: SiblingArea, highlight: boolean, editMode: boolean }> = ({ area, highlight, editMode }) => {
  const { uuid, areaName } = area
  const url = makeUrl(editMode, uuid, areaName)
  return (
    <li className={clx('px-1', highlight ? 'bg-base-200 ' : '')}>
      <a
        href={url}
        className={clx(
          'text-xs tracking-tight hover:link',
          highlight ? 'font-semibold text-primary' : 'font-normal text-secondary')}
      >
        {areaName}
      </a>
    </li>
  )
}
