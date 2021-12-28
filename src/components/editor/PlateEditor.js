import React, { useState } from 'react'
import ReactPlaceholder from 'react-placeholder'
import { createPlateComponents, createPlateOptions } from '@udecode/plate'
import {
  Plate,
  createReactPlugin,
  createHistoryPlugin
} from '@udecode/plate-core'
import { createNormalizeTypesPlugin } from '@udecode/plate-normalizers'
import { createTrailingBlockPlugin } from '@udecode/plate-trailing-block'
import { createBasicMarkPlugins } from '@udecode/plate-basic-marks' // bold, italic, underline
import { createBasicElementPlugins } from '@udecode/plate-basic-elements' // blockquote, codeblock and p
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph'
import { ELEMENT_H1 } from '@udecode/plate-heading' // h1, h2
import { createLinkPlugin } from '@udecode/plate-link'
import { createImagePlugin } from '@udecode/plate-image'
import FormatToolbar from './FormatToolbar'
import { createCustomNormalizingPlugin } from './createCustomNormalizingPlugin'
import { md_to_slate } from './md-utils'

// customize the editor inner container
const editableProps = {
  style: {
    padding: '24px',
    minHeight: '4rem'
    // backgroundColor: "#FEF9E7",
  }
}
const PlateEditor = ({ markdown, onSubmit, debug }) => {
  const components = createPlateComponents()
  const options = createPlateOptions()

  const plugins = [
    // editor
    createReactPlugin(),
    createHistoryPlugin(),
    createLinkPlugin(),
    createImagePlugin(),
    ...createBasicElementPlugins(),
    ...createBasicMarkPlugins(),
    createTrailingBlockPlugin({ type: ELEMENT_PARAGRAPH }),
    createNormalizeTypesPlugin({
      rules: [{ path: [0], strictType: ELEMENT_H1 }]
    }),
    createCustomNormalizingPlugin()
  ]

  const [value, setValue] = useState()

  const onChange = (props) => debug && setValue(props)

  const ast = md_to_slate(markdown)
  return (
    <div className='flex-grow 2xl:w-2/3 2xl:max-w-5xl border-gray-300 border rounded-lg shadow-sm'>
      <FormatToolbar />
      <ReactPlaceholder
        className='p-8 mt-12'
        type='text'
        ready={markdown !== null}
        rows={16}
        color='#F4F6F6'
      >
        <div className='transition duration-850 opacity-100'>
          <Plate
            editableProps={editableProps}
            plugins={plugins}
            components={components}
            options={options}
            initialValue={ast}
            onChange={onChange}
          />
        </div>
      </ReactPlaceholder>
      {debug && (
        <div className='break-all'>
          <pre>{JSON.stringify(value, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default PlateEditor
