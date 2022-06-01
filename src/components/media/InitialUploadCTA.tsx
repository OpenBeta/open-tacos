import { CameraIcon } from '@heroicons/react/outline'
export default function InitialUploadCTA (): JSX.Element {
  return (
    <div className='my-8 flex justify-center flex-wrap'>
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </div>
  )
}

const Placeholder = (): JSX.Element => {
  return (
    <div className='mx-0 my-4 md:m-4 w-[300px] h-[300px] rounded-lg bg-neutral-100 border-neutral-300 border-2 border-dashed flex items-center justify-center'>
      <div className='flex flex-col items-center'>
        <CameraIcon className='stroke-gray-400 stroke-1 w-24 h-24' />
        <span className='text-secondary text-sm'>Click to upload</span>
      </div>
    </div>
  )
}
