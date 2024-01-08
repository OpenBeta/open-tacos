'use client'
import { useEffect, useState, FC, ReactNode } from 'react'
import clx from 'classnames'
import { PlusSquare } from '@phosphor-icons/react/dist/ssr'

import { AreaType } from '@/js/types'
import { getArea } from '@/js/graphql/getArea'
import { makeUrl } from './AreaCrumbs'
import { Card } from '@/components/core/Card'
import { HoverCard } from '@/components/core/HoverCard'

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
  const [siblings, setSiblings] = useState<AreaType[]>([])
  const [loading, setLoading] = useState(false)

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
    getArea(parentUuid, 'cache-first').then((data) => {
      setLoading(false)
      const children = data.area.children
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
            <li className='text-sm'>Loading sibling areas...</li>
            )
          : (
            <>
              {siblings.map((sibling) => (
                <SiblingArea key={sibling.uuid} area={sibling} highlight={sibling.uuid === currentUuid} editMode={editMode} />
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

const SiblingArea: FC<{ area: AreaType, highlight: boolean, editMode: boolean }> = ({ area, highlight, editMode }) => {
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
