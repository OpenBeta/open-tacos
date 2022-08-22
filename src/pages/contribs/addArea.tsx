import { useCallback } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useForm, UseFormReturn } from 'react-hook-form'

import NearAreaPoi from '../../components/search/NearAreaPoi'
import AreaSearch from '../../components/search/AreaSearch'
import MobileCard from '../../components/ui/MobileCard'
import { useWizardStore } from '../../js/stores/wizards'

const AddAreaPage: NextPage<{}> = () => {
  const router = useRouter()

  const onClose = useCallback(async () => {
    await router.replace('/?v=edit')
  }, [])

  const form = useForm()
  const { handleSubmit } = form
  const onSubmit = (data): void => console.log(data)

  return (
    <div className='max-w-md mx-auto pb-8'>
      <MobileCard title='Add an Area' onClose={onClose}>
        <div className='text-xs mt-4'>Area can be a crag, boulder, or a destination containing other smaller areas.</div>
        <ul className='steps w-full mt-8'>
          <li className='step after:!bg-base-200'>
            Location
          </li>
          <li className='step after:!bg-base-200 before:!bg-base-200'>
            New area
          </li>
          <li className='step after:!bg-base-200 before:!bg-base-200'>
            Submit
          </li>
        </ul>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mt-8 text-lg text-content-base font-bold'>Location</div>
          <Step1 />
          <Step2 />
          <div className='mt-8 text-lg text-content-base font-bold'>New area</div>
          <Step3 form={form} />
          <div className='mt-8 text-lg text-content-base font-bold'>Submit</div>
          <Step5 />
        </form>
      </MobileCard>
    </div>
  )
}

const Step1 = (): JSX.Element => {
  const text = useWizardStore().addAreaStore.refContext()
  return (
    <div className='form-control w-full'>
      <label className='label'>
        <span className='label-text font-semibold'>Town, city, or landmark: *</span>
      </label>
      <NearAreaPoi placeholder={text} />
      <label className='label'>
        <span className='label-text-alt text-base-200 text-left'>The more specific the better.</span>
      </label>
    </div>
  )
}

const Step2 = (): JSX.Element => {
  const text = useWizardStore().addAreaStore.refAreaName()
  return (
    <div className='form-control w-full'>
      <label className='label'>
        <span className='label-text font-semibold'>Climbing area:</span>
      </label>
      <AreaSearch placeholder={text} />
      <label className='label'>
        <span className='label-text-alt text-base-200'>Optional climbing area near by.</span>
      </label>
    </div>
  )
}

interface Step3Props {
  form: UseFormReturn
}
const Step3 = ({ form }: Step3Props): JSX.Element => {
  const { register, formState: { errors } } = form
  return (
    <div className='form-control'>
      <label className='label'>
        <span className='label-text font-medium'>Name: *</span>
      </label>
      <input
        {...register('newAreaName', { required: true })}
        type='text'
        placeholder='New area name'
        className='input input-primary input-bordered input-sm'
      />
      <label className='label'>
        {errors.newAreaName != null &&
         (<span className='label-text-alt text-error'>Name is required.</span>)}
      </label>
    </div>
  )
}

// const Step4 = (): JSX.Element => {
//   return (
//     <div className='form-control'>
//       <label className='label'>
//         <span className='label-text font-base'>Name check</span>
//       </label>
//       <progress className='progress w-56 progress-info' />
//       <label className='label'>
//         <span className='label-text-alt text-base-content text-opacity-60'>Area you want to submit.</span>
//       </label>
//     </div>
//   )
// }

const Step5 = (): JSX.Element => {
  return (
    <div className='form-control'>
      <button className='mt-4 btn btn-primary btn-wide btn-sm w-full' type='submit'>Submit</button>
      <label className='label'>
        <span className='label-text-alt text-base-content text-opacity-60'>You can update additional attributes later.</span>
      </label>
    </div>
  )
}

export default AddAreaPage
