import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect, useState } from 'react'
import { $getRoot, $createTextNode, $createParagraphNode } from 'lexical'

import { EditableClimbType } from '../../crag/cragSummary'

interface Props {
  initialValue: string
  editable: boolean
  resetSignal: number
}

/**
 * React Lexical plugin to response to preview/editable mode change
 */
export function PlainTextResetPlugin ({ initialValue, resetSignal, editable = false }: Props): any {
  const [previous, setPrevious] = useState(resetSignal)

  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editable || resetSignal === previous) return

    editor.update(() => {
      setPrevious(resetSignal)
      $createInitialPlainTextState(initialValue)
    }
    )
  }, [resetSignal])

  return null
}

export const $createInitialPlainTextState = (plainText: string): void => {
  const root = $getRoot()

  const paragraph = $createParagraphNode()
  paragraph.append(
    $createTextNode(plainText)
  )
  root
    .clear()
    .append(paragraph)
}

export const $createInitialPlainTextState2 = (climbList: EditableClimbType[]): void => {
  const root = $getRoot()
  // const multilines = plainText.split('\n')
  root.clear()
  climbList.forEach(climb => {
    const paragraph = $createParagraphNode()
    paragraph.append(
      $createTextNode(individualClimbToCsv(climb))
    )
    root.append(paragraph)
  })
}

const individualClimbToCsv = ({ climbId, name }: EditableClimbType): string => {
  return `${climbId ?? ''} | ${name}`
}
