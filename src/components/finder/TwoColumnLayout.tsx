interface TwoColumnLayoutProps {
  left: JSX.Element | JSX.Element []
  right: JSX.Element | JSX.Element []
}

const TwoColumnLayout = ({ left, right }: TwoColumnLayoutProps): JSX.Element => {
  return (
    <div className='hidden xl:block overflow-y'>
      <div className='flex flex-row justify-center items-stretch'>
        <div className='px-4 flex-none max-w-screen-sm w-full'>{left}</div>
        <div className='w-full relative flex mt-0'>
          {right}
        </div>
      </div>
    </div>
  )
}

export default TwoColumnLayout
