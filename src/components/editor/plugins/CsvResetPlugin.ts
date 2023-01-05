import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { useFirstMountState } from 'react-use'

import { $getRoot, $createTextNode, $createParagraphNode } from 'lexical'

import { EditableClimbType } from '../../crag/cragSummary'

interface Props {
  initialValue: EditableClimbType[]
  editable: boolean
  resetSignal: number
}

/**
 * React Lexical plugin to response to preview/editable mode change
 */
export function CsvResetPlugin ({ initialValue, resetSignal, editable = false }: Props): any {
  // const [previous, setPrevious] = useState(resetSignal)

  const [editor] = useLexicalComposerContext()
  const isFirstMount = useFirstMountState()

  useEffect(() => {
    if (!editable || isFirstMount) return
    console.log('#Reset CSV editor', initialValue)

    editor.update(() => {
      // setPrevious(resetSignal)
      $createInitialState(initialValue)
    }
    )
  }, [resetSignal, initialValue])

  return null
}

/**
 * Convert climb list to CSV, 1 climb per line
 * @param climbList
 */
export const $createInitialState = (climbList: EditableClimbType[]): void => {
  const root = $getRoot()
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
