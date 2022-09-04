import { useCallback } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useForm, useFormContext, FormProvider } from 'react-hook-form'
import clx from 'classnames'

import { LocationAutocompleteControl } from '../../components/search/LocationAutocomplete'
import { AreaSearchAutoCompleteControl } from '../../components/search/AreaSearchAutoComplete'
import RadioGroup from '../../components/ui/form/RadioGroup'
import Input from '../../components/ui/form/Input'
import MobileCard from '../../components/ui/MobileCard'
import { useWizardStore, wizardActions } from '../../js/stores/wizards'

const AddAreaPage: NextPage<{}> = () => {
  const router = useRouter()

  const onClose = useCallback(async () => {
    await router.replace('/?v=edit')
  }, [])

  const form = useForm({ mode: 'onBlur', defaultValues: { locationRefType: 'near' } })
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
                ? 'step-success'
                : ''
            )
          }
          >
            Location
          </li>
          <li className={
            clx('step',
              useWizardStore().addAreaStore.steps()[1]
                ? 'step-success'
                : ''
            )
          }
          >
            New area
          </li>
          <li className='step'>
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
  // const { register, watch, formState: { errors } } = useFormContext()

  // useEffect(() => {
  //   const subscription = watch((value) => wizardActions.addAreaStore.recordStep3(value.newAreaName.length > 0))
  //   return () => subscription.unsubscribe()
  // }, [watch])
  return (
    <Input
      label='Name: *'
      name='newAreaName'
      placeholder='New area name'
      rules={{ required: 'Name is required.' }}
      className='input input-primary input-bordered input-md'
    />
  )
}

const Step2b = (): JSX.Element => {
  return (
    <RadioGroup
      groupLabel='Location'
      name='locationRefType'
      labels={['Near by', 'Add as nested area']}
      values={['near', 'child']}
    />
  )
}

const StepSubmit = (): JSX.Element => {
  const { formState } = useFormContext()
  const { isSubmitting } = formState
  return (
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
  )
}

export default AddAreaPage
