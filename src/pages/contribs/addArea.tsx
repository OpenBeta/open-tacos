import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm, useFormContext, FormProvider } from 'react-hook-form'
import clx from 'classnames'
import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'

import { LocationAutocompleteControl } from '../../components/search/LocationAutocomplete'
import { AreaSearchAutoCompleteControl } from '../../components/search/AreaSearchAutoComplete'
import RadioGroup from '../../components/ui/form/RadioGroup'
import Input from '../../components/ui/form/Input'
import { MobileDialog, DialogContent } from '../../components/ui/MobileDialog'
import { useWizardStore, wizardActions, addAreaStore } from '../../js/stores/wizards'
import { PoiDoc } from '../../components/search/sources/PoiSource2'
import { MUTATION_ADD_AREA, AddAreaProps, AddAreaReturnType } from '../../js/graphql/contribGQL'
import { graphqlClient } from '../../js/graphql/Client'
import { INextPageWithAuth } from '../../js/types/INext'
import { AddSucessAlert, AddErrorAlert } from '../../components/contribs/AddChildAreaForm'

interface AddAreaFormProps {
  newAreaName: string
  placeSearch: string
  locationRefType: 'near' | 'child'
  refAreaName: string
}

const AddAreaPage: INextPageWithAuth = () => {
  const router = useRouter()
  const session = useSession()

  const [addArea, { error, data }] = useMutation<{ addArea: AddAreaReturnType }, AddAreaProps>(
    MUTATION_ADD_AREA, {
      client: graphqlClient,
      onCompleted: (data) => {
        wizardActions.addAreaStore.recordStepFinal()
        void fetch(`/api/revalidate?a=${data.addArea.uuid}`)
        void fetch('/api/revalidate?page=/contribs')
      }
    }
  )

  const form = useForm<AddAreaFormProps>(
    {
      mode: 'onBlur',
      defaultValues: { locationRefType: 'near', newAreaName: '', placeSearch: '', refAreaName: '' }
    })
  const { handleSubmit, formState: { isSubmitSuccessful }, reset } = form

  // Go back to previous screen
  const onClose = useCallback(async () => {
    await router.replace('/contribs')
  }, [])

  // Submit form
  const onSubmit = async (formFields: AddAreaFormProps): Promise<void> => {
    const { newAreaName, placeSearch, locationRefType } = formFields
    const refUuid = addAreaStore.get.refAreaData()
    try {
      await addArea({
        variables: {
          name: newAreaName,
          parentUuid: locationRefType === 'child' && refUuid != null ? refUuid : null,
          countryCode: placeSearch
        },
        context: {
          headers: {
            authorization: `Bearer ${session?.data?.accessToken as string ?? ''}`
          }
        }
      })
    } catch (e) {
      console.log('Error adding area', e)
    }
  }

  const onResetForm = (): void => {
    // Reset form state
    reset()
    // Partially reset wizard state (keeping initial location since users likely add a new area near by)
    wizardActions.addAreaStore.resetStep1b()
    wizardActions.addAreaStore.resetStepFinal()
  }

  return (
    <MobileDialog defaultOpen onOpenChange={onClose} modal={false}>
      <DialogContent
        title='Add an Area'
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
      >
        <div className='text-xs mt-4'>Area can be a crag, boulder, or a destination containing other smaller areas.</div>
        <ProgressSteps />
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mt-8 text-lg text-content-base font-bold'>Location</div>
            <Step1a />
            <Step1b />
            <div className='mt-8 text-lg text-content-base font-bold'>New area</div>
            <Step2a />
            {useWizardStore().addAreaStore.refAreaData() !== '' && <Step2b />}
            <div className='mt-8 text-lg text-content-base font-bold'>Submit</div>
            <StepSubmit />
          </form>
        </FormProvider>
        {isSubmitSuccessful && error == null && data != null &&
          <AddSucessAlert {...data.addArea} onContinue={onResetForm} />}
        {error != null && <AddErrorAlert {...error} />}
      </DialogContent>
    </MobileDialog>
  )
}

const Step1a = (): JSX.Element => {
  const text = useWizardStore().addAreaStore.refContext()
  const countryCode = useWizardStore().addAreaStore.refContextData().countryCode

  const { formState: { errors } } = useFormContext()

  const handleSelect = useCallback((data: PoiDoc): void => {
    wizardActions.addAreaStore.recordStep1a(data.place_name, data.center, data.countryCode)
  }, [])

  const handleReset = useCallback((): void => {
    wizardActions.addAreaStore.resetLocation()
  }, [])

  const queryParams = {
    text,
    data: countryCode
  }
  return (
    <LocationAutocompleteControl
      label='Place: *'
      placeholder={text}
      onSelect={handleSelect}
      onReset={handleReset}
      queryParams={queryParams}
      errorMesage={errors.placeSearch?.message as string}
      tip='Town/city/country.  The more specific the better.'
    />
  )
}

const Step1b = (): JSX.Element => {
  const { resetField } = useFormContext()

  const text = useWizardStore().addAreaStore.refAreaName()
  const query = {
    text,
    data: {
      latlng: useWizardStore().addAreaStore.refContextData().latlng
    }
  }

  const handleSelect = useCallback((data): void => {
    wizardActions.addAreaStore.recordStep1b(data.name, data.areaUUID)
  }, [])

  const handleReset = (): void => {
    resetField('locationRefType')
    wizardActions.addAreaStore.resetStep1b()
  }

  return (
    <AreaSearchAutoCompleteControl
      label='Reference climbing area:'
      id='refAreaName'
      placeholder={text == null || text === '' ? 'Area name' : text}
      queryParams={query}
      onSelect={handleSelect}
      onReset={handleReset}
      tip='Optional climbing area near by.'
    />
  )
}

const Step2a = (): JSX.Element => {
  const context = useFormContext()
  const { watch } = context

  useEffect(() => {
    // update Step progress
    const subscription = watch((value) =>
      wizardActions.addAreaStore.recordStep2(value.newAreaName.length > 0)
    )
    return () => subscription.unsubscribe()
  }, [])

  return (
    <Input
      label='Name: *'
      name='newAreaName'
      placeholder='New area name'
      registerOptions={{ required: 'Name is required.' }}
      formContext={context}
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
      >Add Area
      </button>
      <label className='label'>
        <span className='label-text-alt text-base-content text-opacity-60'>You can update additional attributes later.</span>
      </label>
    </div>
  )
}

const ProgressSteps = (): JSX.Element => (
  <ul className='steps w-full mt-8'>
    <li className={clx('step',
      useWizardStore().addAreaStore.steps()[0]
        ? 'step-success'
        : ''
    )}
    >
      Location
    </li>
    <li className={clx('step',
      useWizardStore().addAreaStore.steps()[1]
        ? 'step-success'
        : ''
    )}
    >
      New area
    </li>
    <li
      className={clx('step',
        useWizardStore().addAreaStore.steps()[2]
          ? 'step-success'
          : ''
      )}
      data-content={useWizardStore().addAreaStore.steps()[2] ? '✓' : undefined}
    >
      Submit
    </li>
  </ul>
)

AddAreaPage.auth = true

export default AddAreaPage
