import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { usePlateEditorRef, getPlatePluginType } from '@udecode/plate-core'
import { ELEMENT_H1, ELEMENT_H2 } from '@udecode/plate-heading'
import { MARK_BOLD, MARK_CODE, MARK_ITALIC } from '@udecode/plate-basic-marks'

import { MarkToolbarButton, BlockToolbarButton } from '@udecode/plate-toolbar'
import { insertImage } from '@udecode/plate-image'

import {
  IconBold,
  IconItalic,
  IconCode,
  IconH1,
  IconH2,
  IconPhoto
} from './ToolbarIcons'

import PhotoUploadProgress from './PhotoUploadProgress'
import { upload_image } from '../../js/image-utils'

const FormatToolbar = () => {
  const editor = usePlateEditorRef()
  const [uploading, setUploading] = useState(false)

  const onload = async (event) => {
    // Do whatever you want with the file contents
    const binaryStr = event.target.result
    setUploading(true)
    const url = await upload_image(binaryStr)
    setUploading(false)
    if (editor) {
      insertImage(editor, url)
    }
  }
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      acceptedFiles.forEach((file) => {
        if (file.size > 5242880) {
          alert('You tried to upload a photo larger than 5MB')
          return
        }
        const reader = new FileReader()
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = onload
        reader.readAsDataURL(file)
      })
    },
    [editor]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: 'image/jpeg, image/png'
  })

  return (
    <>
      <PhotoUploadProgress open={uploading} />
      <div className='max-w-full flex nowrap items-center	pt-1.5 gap-x-4 border-b px-4 bg-gray-100 rounded-t-lg'>
        <MarkToolbarButton
          type={getPlatePluginType(editor, MARK_BOLD)}
          icon={<IconBold />}
        />
        <MarkToolbarButton
          type={getPlatePluginType(editor, MARK_ITALIC)}
          icon={<IconItalic />}
        />
        <MarkToolbarButton
          type={getPlatePluginType(editor, MARK_CODE)}
          icon={<IconCode />}
        />
        <BlockToolbarButton
          type={getPlatePluginType(editor, ELEMENT_H1)}
          icon={<IconH1 />}
        />
        <BlockToolbarButton
          type={getPlatePluginType(editor, ELEMENT_H2)}
          icon={<IconH2 />}
        />
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <BlockToolbarButton
            // type={getPlatePluginType(editor, ELEMENT_H2)}
            icon={<IconPhoto />}
          />
        </div>
        {/* Comment out due to https://github.com/udecode/plate/issues/938
       <ToolbarLink icon={<IconURL />} /> */}
      </div>
    </>
  )
}

export default FormatToolbar
