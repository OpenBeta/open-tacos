interface TwoColumnLayoutProps {
  left: JSX.Element | JSX.Element []
  right: JSX.Element | JSX.Element []
}

const TwoColumnLayout = ({ left, right }: TwoColumnLayoutProps): JSX.Element => {
  return (
    <div className='hidden xl:block overflow-y'>
      <div className='flex flex-row gap-x-4 justify-center items-stretch'>
        <div className='flex-none max-w-screen-md w-full'>{left}</div>
        <div className='w-full relative flex mt-0'>
          {right}
        </div>
      </div>
    </div>
  )
}

export default TwoColumnLayout
