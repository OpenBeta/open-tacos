import { useCallback, useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useForm, useFormContext, FormProvider } from 'react-hook-form'
import clx from 'classnames'

import { LocationAutocompleteControl } from '../../components/search/LocationAutocomplete'
import { AreaSearchAutoCompleteControl } from '../../components/search/AreaSearchAutoComplete'
import MobileCard from '../../components/ui/MobileCard'
import { useWizardStore, wizardActions } from '../../js/stores/wizards'

const AddAreaPage: NextPage<{}> = () => {
  const router = useRouter()

  const onClose = useCallback(async () => {
    await router.replace('/?v=edit')
  }, [])

  const form = useForm({ mode: 'onBlur' })
  const { handleSubmit } = form
  const onSubmit = async (data): Promise<void> => {
    console.log(data)
    // eslint-disable-next-line
    await new Promise(r => setTimeout(r, 2000))
  }

  return (
    <div className='max-w-md mx-auto pb-8'>
      <MobileCard title='Add an Area' onClose={onClose}>
        <div className='text-xs mt-4'>Area can be a crag, boulder, or a destination containing other smaller areas.</div>
        <ul className='steps w-full mt-8'>
          <li className={
            clx('step',
              useWizardStore().addAreaStore.steps()[0]
                ? 'step-secondary'
                : 'after:!bg-base-200'
            )
          }
          >
            Location
          </li>
          <li className={
            clx('step',
              useWizardStore().addAreaStore.steps()[1]
                ? 'step-secondary'
                : 'step after:!bg-base-200 before:!bg-base-200'
            )
          }
          >
            New area
          </li>
          <li className='step after:!bg-base-200 before:!bg-base-200'>
            Submit
          </li>
        </ul>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mt-8 text-lg text-content-base font-bold'>Location</div>
            <Step1a />
            <Step1b />
            <div className='mt-8 text-lg text-content-base font-bold'>New area</div>
            {useWizardStore().addAreaStore.refAreaData() !== '' && <Step2b />}
            <Step2a />
            <div className='mt-8 text-lg text-content-base font-bold'>Submit</div>
            <StepSubmit />
          </form>
        </FormProvider>
      </MobileCard>
    </div>
  )
}

const Step1a = (): JSX.Element => {
  const text = useWizardStore().addAreaStore.refContext()

  const { formState: { errors } } = useFormContext()

  const handleSelect = useCallback((data): void => {
    wizardActions.addAreaStore.recordStep1a(data.place_name, data.center)
  }, [])

  const handleReset = useCallback((): void => {
    wizardActions.addAreaStore.resetLocation()
  }, [])

  const queryParams = {
    text,
    data: undefined
  }
  return (
    <LocationAutocompleteControl
      label='Town, city, or landmark: *'
      placeholder={text}
      onSelect={handleSelect}
      onReset={handleReset}
      queryParams={queryParams}
      errorMesage={errors.placeSearch?.message as string}
      tip='The more specific the better.'
    />
  )
}

const Step1b = (): JSX.Element => {
  const text = useWizardStore().addAreaStore.refAreaName()
  const query = {
    text,
    data: {
      latlng: useWizardStore().addAreaStore.refContextData()
    }
  }

  const handleSelect = useCallback((data): void => {
    wizardActions.addAreaStore.recordStep2(data.name, data.areaUUID)
  }, [])

  const handleReset = useCallback((): void => {
    wizardActions.addAreaStore.resetStep2()
  }, [])

  return (
    <AreaSearchAutoCompleteControl
      label='Climbing area:'
      placeholder={text}
      queryParams={query}
      onSelect={handleSelect}
      onReset={handleReset}
      tip='Optional climbing area near by.'
    />
  )
}

const Step2a = (): JSX.Element => {
  const { register, watch, formState: { errors } } = useFormContext()

  useEffect(() => {
    const subscription = watch((value) => wizardActions.addAreaStore.recordStep3(value.newAreaName.length > 0))
    return () => subscription.unsubscribe()
  }, [watch])
  return (
    <>
      <div className='form-control'>
        <label className='label'>
          <span className='label-text font-semibold'>Name: *</span>
        </label>
        <input
          {...register('newAreaName', { required: true })}
          type='text'
          placeholder='New area name'
          className='input input-primary input-bordered input-md'
        />
        <label className='label'>
          {errors.newAreaName != null &&
         (<span className='label-text-alt text-error'>Name is required.</span>)}
        </label>
      </div>
    </>
  )
}

const Step2b = (): JSX.Element => {
  return (
    <>
      <div className='form-control'>
        <label className='label cursor-pointer'>
          <span className='label-text'>Add as neighbor</span>
          <input type='radio' name='radio-6' className='radio' checked />
        </label>
      </div>
      <div className='form-control'>
        <label className='label cursor-pointer'>
          <span className='label-text'>Add as sub-area</span>
          <input type='radio' name='radio-6' className='radio' />
        </label>
      </div>
    </>
  )
}

const StepSubmit = (): JSX.Element => {
  const { formState } = useFormContext()
  const { isSubmitting } = formState
  return (
    <>
      <div className='form-control'>
        <button
          className={
          clx(
            'mt-4 btn btn-primary btn-wide btn-md w-full',
            isSubmitting ? 'loading btn-disabled' : ''
          )
        }
          type='submit'
        >Submit
        </button>
        <label className='label'>
          <span className='label-text-alt text-base-content text-opacity-60'>You can update additional attributes later.</span>
        </label>
      </div>
    </>
  )
}

export default AddAreaPage
