import { EditorThemeClasses } from 'lexical/LexicalEditor'

export const MDWithPreviewTheme: EditorThemeClasses = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'mdeditor-placeholder',
  input: 'mdeditor-input',
  paragraph: 'mdeditor-paragraph',
  link: 'underline',
  list: {
    nested: {
      listitem: 'editor-nested-listitem'
    },
    ol: 'list-decimal mb-4',
    ul: 'list-disc mb-4',
    listitem: 'list-inside'
  }
}
