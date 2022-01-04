import React from 'react'

import { Plate, createParagraphPlugin, createListPlugin, createImagePlugin, createPlugins, createPlateUI } from '@udecode/plate'

import { mdToSlate } from './md-utils'

// customize the editor inner container
const editableProps = {
  style: {
    // backgroundColor: '#FEF9E7'
  },
  readOnly: true
}
const InlineEditor = ({ markdown, readOnly, id }): JSX.Element => {
  const plugins = createPlugins([
    createParagraphPlugin(),
    createImagePlugin(),
    createListPlugin()
  ], {
    components: createPlateUI()
  })
  const ast = mdToSlate(markdown)
  return (
    <Plate
      id={id}
      editableProps={editableProps}
      plugins={plugins}
      initialValue={ast}
    />
  )
}

export default InlineEditor
