import { InitialConfigType } from '@lexical/react/LexicalComposer'
import ExampleTheme from './themes/ExampleTheme'

const editorConfig: InitialConfigType = {
  namespace: 'editor',
  theme: ExampleTheme,
  onError (error) {
    throw error
  },
  nodes: []
}

export default editorConfig
