import { EditorState, LexicalEditor, $getRoot, TextNode } from 'lexical'
import { ControllerRenderProps, FieldValues, UseFieldArrayReplace } from 'react-hook-form'
import { validate as isUuid, v4 as uuidV4 } from 'uuid'
import { indexBy, Dictionary } from 'underscore'

import { EditableClimbType } from '../crag/cragSummary'
import { codesToDisciplines, defaultDisciplines } from '../../js/grades/util'
import type { GradeHelper } from '../../js/grades/Grade'

export default function onChange (editorState: EditorState, editor: LexicalEditor, field: ControllerRenderProps): void {
  if (field?.onChange == null) return
  editorState.read(() => {
    const root = $getRoot()
    field?.onChange(root.getTextContent()?.trim())
  })
}

export function onChangeCsv (
  editorState: EditorState,
  editor: LexicalEditor,
  replace: UseFieldArrayReplace<FieldValues, string>,
  fields: any[],
  gradeHelper: GradeHelper): void {
  editorState.read(() => {
    const defaultClimbDict = indexBy<EditableClimbType[]>(fields, 'climbId')
    const root = $getRoot()
    const lines = root.getAllTextNodes().reduce((acc: EditableClimbType[], currentLine, index) => {
      const curr = parseLine(currentLine, index, defaultClimbDict, gradeHelper)
      if (curr != null) {
        acc.push(curr)
      }
      return acc
    }
    , [])

    replace(lines)
  })
}

const parseLine = (line: TextNode, index: number, defaultClimbDict: Dictionary<EditableClimbType>, gradeHelper: GradeHelper): EditableClimbType | null => {
  const tokens = line.getTextContent()?.trim().split(/\s*\|\s*/)
  return csvToClimb(tokens, index, defaultClimbDict, gradeHelper)
}

export const csvToClimb = (tokens: string[], index: number, defaultClimbDict: Dictionary<EditableClimbType>, gradeHelper: GradeHelper): EditableClimbType | null => {
  if (tokens.length >= 2) {
    const firstToken = tokens[0].trim()
    const climbIdValidFormat = isUuid(firstToken)

    let climbId = uuidV4()

    if (climbIdValidFormat) {
      climbId = firstToken
      tokens.shift()
    }
    let name = tokens[0].trim()
    if (name === '') { name = 'Untitled' }

    const gradeStr = tokens[1] ?? ''

    const [disciplines, disciplinesHaveErrors] = codesToDisciplines(tokens[2] ?? '')

    let disciplinesError: string | undefined
    if (disciplinesHaveErrors) {
      disciplinesError = 'Disciplines formatting error.  Valid codes: B S T TR A.'
    } else if (Object.keys(disciplines).length === 0) {
      disciplinesError = 'Disciplines not set'
    } else {
      disciplinesError = undefined
    }

    return {
      id: climbId,
      climbId,
      name,
      leftRightIndex: index,
      gradeStr,
      isNew: !climbIdValidFormat,
      errors: {
        gradeStr: gradeHelper.validate(gradeStr),
        disciplines: disciplinesError
      },
      disciplines
    }
  }

  // ONLY 1 TOKEN
  if (tokens.length === 1) {
    if (isUuid(tokens[0].trim())) {
      // first token is a valid UUID
      const climbId = tokens[0].trim()
      return {
        id: index.toString(),
        climbId,
        name: `Untitled ${index + 1}`,
        leftRightIndex: index,
        gradeStr: climbId != null && defaultClimbDict?.[climbId] != null ? defaultClimbDict?.[climbId].gradeStr : undefined,
        disciplines: defaultClimbDict?.[climbId] != null ? defaultClimbDict[climbId].disciplines : defaultDisciplines()
      }
    }

    // First token is not a valid UUID (Common use case) --> first token is a climb name
    const name = tokens[0].trim()
    return {
      id: index.toString(),
      climbId: uuidV4(),
      name,
      leftRightIndex: index,
      gradeStr: '',
      isNew: true,
      disciplines: defaultDisciplines(),
      errors: {
        gradeStr: 'Grade not set',
        disciplines: 'Disciplines not set'
      }

    }
  }
  return {
    id: index.toString(),
    climbId: uuidV4(),
    name: `Untitled ${index + 1}`,
    leftRightIndex: index,
    gradeStr: '',
    isNew: true,
    disciplines: defaultDisciplines(),
    errors: {
      gradeStr: 'Grade not set',
      disciplines: 'Disciplines not set'
    }
  }
}
