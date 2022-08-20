import { useCallback } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import NearAreaPoi from '../../components/search/NearAreaPoi'
import MobileCard from '../../components/ui/MobileCard'
import { useWizardStore } from '../../js/stores/wizards'

const AddAreaPage: NextPage<{}> = () => {
  const router = useRouter()

  const onClose = useCallback(async () => {
    await router.replace('/?v=edit')
  }, [])

  return (
    <div data-theme='light' className='h-screen max-w-md mx-auto'>
      <MobileCard title='Add an Area' onClose={onClose}>
        <div className='text-xs'>Area can be a crag, boulder, or a destination containing other smaller areas.</div>
        <ul className='steps step-secondary steps-vertical gap-y-4'>
          <li className='step'>
            <AddAreaStep1 />
          </li>
          <li className='step'>
            <Step2 />
          </li>
          <li className='step'>
            <Step3 />
          </li>
          <li className='step'>
            <Step4 />
          </li>
          <li className='step'>
            <Step5 />
          </li>
        </ul>
      </MobileCard>
    </div>
  )
}

const AddAreaStep1 = (): JSX.Element => {
  const text = useWizardStore().addAreaStore.refName()
  return (
    <div className='form-control'>
      <label className='label'>
        <span className='label-text font-semibold'>General location *</span>
      </label>
      <NearAreaPoi placeholder={text} />
      <label className='label'>
        <span className='label-text-alt text-base-content text-opacity-60 text-left'>Town, city, or country.<br />The more specific the better.</span>
        <span>s</span>
      </label>
    </div>
  )
}

const Step2 = (): JSX.Element => {
  const text = useWizardStore().addAreaStore.refName()
  return (
    <div className='form-control w-full'>
      <label className='label'>
        <span className='label-text font-semibold'>Near by climbing area</span>
      </label>
      <NearAreaPoi placeholder={text} />
      <label className='label'>
        <span className='label-text-alt text-base-content text-opacity-60'>Optional climbing area near by.</span>
      </label>
    </div>
  )
}

const Step3 = (): JSX.Element => {
  return (
    <div className='form-control'>
      <label className='label'>
        <span className='label-text font-semibold'>New area name *</span>
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
      <button className='btn btn-primary btn-wide btn-sm'>Submit</button>
      <label className='label'>
        <span className='label-text-alt text-base-content text-opacity-60'>You can update additional attributes later.</span>
      </label>
    </div>
  )
}

export default AddAreaPage
