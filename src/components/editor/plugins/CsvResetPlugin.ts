import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { useFirstMountState } from 'react-use'
import { $getRoot, $createTextNode, $createParagraphNode } from 'lexical'

import { EditableClimbType } from '../../crag/cragSummary'
import { disciplinesToCodes } from '../../../js/grades/util'

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
      $createTextNode(individualClimbToTokenDelimitedStr(climb))
    )
    root.append(paragraph)
  })
}

export const individualClimbToTokenDelimitedStr = ({ climbId, name, gradeStr, disciplines }: EditableClimbType): string => {
  return `${climbId ?? ''} | ${name} | ${gradeStr ?? ''} | ${disciplinesToCodes(disciplines).join(' ')}`
}
