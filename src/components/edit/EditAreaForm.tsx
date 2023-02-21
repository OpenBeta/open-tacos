import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import clx from 'classnames'
import { signIn, useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

import { Input, TextArea } from '../ui/form'
import { AreaType, AreaUpdatableFieldsType, RulesType } from '../../js/types'
import { areaDesignationToForm, areaDesignationToDb, AreaTypeFormProp, AreaDesignationRadioGroup } from './form/AreaDesignationRadioGroup'
import useUpdateAreasCmd from '../../js/hooks/useUpdateAreasCmd'

export const LATLNG_PATTERN = /(?<lat>^[-+]?(?:[1-8]?\d(?:\.\d+)?|90(?:\.0+)?)),(?<lng>[-+]?(?:180(?:\.0+)?|(?:1[0-7]\d|[1-9]?\d)(?:\.\d+)?))$/

export const AREA_NAME_FORM_VALIDATION_RULES: RulesType = {
  required: 'A name is required.',
  minLength: {
    value: 2,
    message: 'Minimum 2 characters.'
  },
  maxLength: {
    value: 120,
    message: 'Maxium 120 characters.'
  }
}

export const AREA_LATLNG_FORM_VALIDATION_RULES: RulesType = {
  validate: {
    validLatLng:
    (v: string): string | undefined => {
      if (v.length === 0) return undefined
      return LATLNG_PATTERN.test(v) ? undefined : 'Invalid coordinates. Example: 46.433333,11.85'
    }
  }
}

export const AREA_DESCRIPTION_FORM_VALIDATION_RULES: RulesType = {
  maxLength: {
    value: 3500,
    message: 'Maxium 3500 characters.'
  }
}

export interface ChildAreaBaseProps {
  areaUuid: string
  areaName: string
}

interface HtmlFormProps extends AreaUpdatableFieldsType {
  latlng: string
  areaType: AreaTypeFormProp
}

export default function AreaEditForm (props: AreaType & { formRef?: any }): JSX.Element {
  const { uuid, areaName, shortCode, pathTokens, content: { description }, children, climbs, metadata, formRef } = props
  const { lat, lng } = metadata

  const session = useSession()
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
  }, [session])

  // Track submit count
  // react-hook-form has a similar prop but it gets reset when we call `form.reset()`
  const [submitCount, setSubmitCount] = useState(0)

  const { updateOneAreaCmd } = useUpdateAreasCmd({
    areaId: uuid,
    accessToken: session?.data?.accessToken as string,
    onUpdateCompleted: (data) => {
      setSubmitCount(old => old + 1)
    }
  })

  // React-hook-form declaration
  const form = useForm<HtmlFormProps>(
    {
      mode: 'onBlur',
      defaultValues: {
        areaName,
        shortCode,
        latlng: `${lat.toString()},${lng.toString()}`,
        areaType: areaDesignationToForm(metadata),
        description
      }
    })

  const { handleSubmit, formState: { isSubmitting, dirtyFields }, reset, getValues } = form

  const submitHandler = async ({ areaName, shortCode, latlng, isDestination, areaType, description }: HtmlFormProps): Promise<void> => {
    const { uuid } = props
    const [latStr, lngStr] = latlng.split(',')

    const doc = {
      // @ts-expect-error
      ...dirtyFields?.areaName === true && { areaName: getValues('areaName') ?? '' },
      ...dirtyFields?.shortCode === true && { shortCode: getValues('shortCode') },
      ...dirtyFields?.isDestination === true && { isDestination: getValues('isDestination') },
      ...dirtyFields?.areaType === true && canChangeAreaType && areaDesignationToDb(areaType),
      ...dirtyFields?.latlng === true && { ...{ lat: parseFloat(latStr), lng: parseFloat(lngStr) } },
      ...dirtyFields?.description === true && { description: getValues('description') }
    }

    const isEmptyDoc = Object.keys(doc).length === 0
    if (isEmptyDoc) {
      toast.warn('Nothing to save.  Please make at least 1 edit.')
    } else {
      await updateOneAreaCmd({ ...doc, uuid })
      const values = Object.assign({}, doc, dirtyFields?.latlng === true ? { latlng } : undefined)
      reset(values, { keepValues: true })
    }
  }

  useEffect(() => {
    formRef.current = submitCount
  }, [submitCount])

  if (session.status !== 'authenticated') {
    return (
      <div>Checking authorization...</div>
    )
  }

  const MIN2PATTERN = /^[a-zA-Z0-9]*$/

  const isCountry = pathTokens.length === 1
  const canChangeAreaType = children.length === 0 && climbs.length === 0

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(submitHandler)} className='dialog-form-default'>
        <Input
          label='Name:'
          name='areaName'
          placeholder='Area name'
          disabled={isCountry}
          registerOptions={AREA_NAME_FORM_VALIDATION_RULES}
        />
        <Input
          label='Short code:'
          name='shortCode'
          placeholder='Short code'
          disabled={isCountry}
          registerOptions={{
            maxLength: 5,
            validate: {
              min2AlphaNumeric:
                (v: string): string | undefined => {
                  if (v.length === 0) return undefined
                  if (v.length < 2) return 'Minimum 2 characters'
                  return MIN2PATTERN.test(v) ? undefined : 'Please use only letters and numbers'
                }
            }
          }}
          className='uppercase'
        />
        <Input
          label='Latitude, longtitude:'
          name='latlng'
          placeholder='latitude, longtitude'
          registerOptions={AREA_LATLNG_FORM_VALIDATION_RULES}
        />
        <AreaDesignationRadioGroup disabled={!canChangeAreaType} />
        <TextArea
          label='Description:'
          name='description'
          placeholder='Area description'
          registerOptions={AREA_DESCRIPTION_FORM_VALIDATION_RULES}
          rows={8}
        />
        <button
          className={
            clx('mt-4 btn btn-primary w-full',
              isSubmitting ? 'loading btn-disabled' : ''
            )
          }
          type='submit'
        >Save
        </button>
      </form>
    </FormProvider>
  )
}
