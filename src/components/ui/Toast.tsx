import * as PrimitiveToast from '@radix-ui/react-toast'

export default function Toast ({ title, desc }): JSX.Element {
  return (
    <PrimitiveToast.Provider>
      <PrimitiveToast.Root>
        <PrimitiveToast.Title>
          {title}
        </PrimitiveToast.Title>
        <PrimitiveToast.Description>
          {desc}
        </PrimitiveToast.Description>
        <PrimitiveToast.Action altText='Close' />
        <PrimitiveToast.Close />
      </PrimitiveToast.Root>
      <PrimitiveToast.Viewport />
    </PrimitiveToast.Provider>
  )
}
