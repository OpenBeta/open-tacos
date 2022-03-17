interface TwoColumnLayoutProps {
  left: JSX.Element | JSX.Element []
  right: JSX.Element | JSX.Element []
}

const TwoColumnLayout = ({ left, right }: TwoColumnLayoutProps): JSX.Element => {
  return (
    <div className='overflow-y'>
      <div className='xl:flex xl:flex-row xl:gap-x-4 xl:justify-center xl:items-stretch'>
        <div className='xl:flex-none xl:max-w-screen-md xl:w-full'>{left}</div>
        <div className='w-full relative flex xl:mt-0'>
          {right}
        </div>
      </div>
    </div>
  )
}

export default TwoColumnLayout
