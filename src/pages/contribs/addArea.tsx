import { useCallback } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import NearAreaPoi from '../../components/search/NearAreaPoi'
import AreaSearch from '../../components/search/AreaSearch'
import MobileCard from '../../components/ui/MobileCard'
import { useWizardStore } from '../../js/stores/wizards'

const AddAreaPage: NextPage<{}> = () => {
  const router = useRouter()

  const onClose = useCallback(async () => {
    await router.replace('/?v=edit')
  }, [])

  return (
    <div className='max-w-md mx-auto pb-16 bg-base-200'>
      <MobileCard title='Add an Area' onClose={onClose}>
        <div className='text-xs'>Area can be a crag, boulder, or a destination containing other smaller areas.</div>
        <ul className='steps w-full mt-8'>
          <li className='step step-info'>
            Location
          </li>
          <li className='step step-info'>
            New area
          </li>
          <li className='step step-info'>
            Submit
          </li>
        </ul>
        <div className='mt-8 text-lg text-content-base font-bold'>Location</div>
        <Step1 />
        <Step2 />
        <div className='mt-8 text-lg text-content-base font-bold'>New area</div>
        <Step3 />
        <Step4 />
        <div className='mt-8 text-lg text-content-base font-bold'>Submit</div>
        <Step5 />
      </MobileCard>
    </div>
  )
}

const Step1 = (): JSX.Element => {
  const text = useWizardStore().addAreaStore.refContext()
  return (
    <div className='form-control w-full'>
      <label className='label'>
        <span className='label-text font-medium'>Town, city, or landmark: *</span>
      </label>
      <NearAreaPoi placeholder={text} />
      <label className='label'>
        <span className='label-text-alt text-base-300 text-left'>The more specific the better.</span>
      </label>
    </div>
  )
}

const Step2 = (): JSX.Element => {
  const text = useWizardStore().addAreaStore.refAreaName()
  return (
    <div className='form-control w-full'>
      <label className='label'>
        <span className='label-text font-medium'>Climbing area:</span>
      </label>
      <AreaSearch placeholder={text} />
      <label className='label'>
        <span className='label-text-alt text-base-300'>Optional climbing area near by.</span>
      </label>
    </div>
  )
}

const Step3 = (): JSX.Element => {
  return (
    <div className='form-control'>
      <label className='label'>
        <span className='label-text font-medium'>New area name: *</span>
      </label>
      <input type='text' placeholder='Type here' className='input input-bordered input-sm' />
      <label className='label'>
        <span className='label-text-alt text-base-content text-opacity-60'>Area you want to submit.</span>
      </label>
    </div>
  )
}

const Step4 = (): JSX.Element => {
  return (
    <div className='form-control'>
      <label className='label'>
        <span className='label-text font-base'>Name check</span>
      </label>
      <progress className='progress w-56 progress-info' />
      <label className='label'>
        <span className='label-text-alt text-base-content text-opacity-60'>Area you want to submit.</span>
      </label>
    </div>
  )
}

const Step5 = (): JSX.Element => {
  return (
    <div className='form-control'>
      <label className='label'>
        <span className='label-text font-base'>Save your input</span>
      </label>
      <button className='btn btn-primary btn-wide btn-sm'>Submit</button>
      <label className='label'>
        <span className='label-text-alt text-base-content text-opacity-60'>You can update additional attributes later.</span>
      </label>
    </div>
  )
}

export default AddAreaPage
