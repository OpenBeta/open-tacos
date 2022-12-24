import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { $getRoot, $insertNodes, LexicalEditor } from 'lexical'
import { $generateNodesFromDOM } from '@lexical/html'

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
interface Props {
  initialValue?: string
  editable: boolean
}
export default function MyCustomAutoFocusPlugin ({ initialValue, editable = false }: Props): any {
  const [editor] = useLexicalComposerContext()

  const updateHTML = (editor: LexicalEditor, value: string, clear: boolean): void => {
    const root = $getRoot()
    const parser = new DOMParser()
    const dom = parser.parseFromString(value, 'text/html')
    const nodes = $generateNodesFromDOM(editor, dom)
    if (clear) {
      root.clear()
    }
    $getRoot().select()
    $insertNodes(nodes)
  }

  useEffect(() => {
    // Focus the editor when the effect fires!
    if (editor != null && initialValue != null) {
      editor.update(() => updateHTML(editor, initialValue, false))
    }
  }, [editor])

  useEffect(() => {
    if (editor != null) {
      editor.setEditable(editable)
    }
  }, [editable])
  return null
}
