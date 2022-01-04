import React from 'react'

import { Plate, createParagraphPlugin, createListPlugin, createPlugins, createPlateUI } from '@udecode/plate'

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
    createListPlugin()

  ], {
    components: createPlateUI()
  })

  const ast = mdToSlate(markdown)
  console.log(ast)
  return (
    <div className='plate'>
      <Plate
        id={id}
        editableProps={editableProps}
        plugins={plugins}
        // components={components}
        // options={options}
        initialValue={ast}
      />
    </div>
  )
}

export default InlineEditor
