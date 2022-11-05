import React from 'react'

interface InlineEditorProps {
  p: string
}

export default function InlineEditor ({ p }: InlineEditorProps): JSX.Element {
  return (<div>{p}</div>
  // <>
  //   {/* {lines.map((line, index) => <div key={index}>{line}</div>)} */}
  // </>
  )
}
