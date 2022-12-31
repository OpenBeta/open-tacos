import { useEffect, useState, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import clx from 'classnames'
import { useMutation } from '@apollo/client'
import { signIn, useSession } from 'next-auth/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'

import { MUTATION_UPDATE_AREA, UpdateAreaReturnType, UpdateAreaProps } from '../../js/graphql/gql/contribs'
import { ErrorAlert } from './alerts/Alerts'
import { graphqlClient } from '../../js/graphql/Client'
import { Input, TextArea, RadioGroup } from '../ui/form'
import Toast from '../ui/Toast'
import { AreaType, AreaUpdatableFieldsType, RulesType } from '../../js/types'

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
  areaType: 'area' | 'leaf'
}

export default function AreaEditForm (props: AreaType & { formRef?: any }): JSX.Element {
  const session = useSession()
  const toastRef = useRef<any>()
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
  }, [session])

  // Track submit count
  // react-hook-form has a similar prop but it gets reset when we call  `form.reset()`
  const [submitCount, setSubmitCount] = useState(0)

  const [updateArea, { error: gqlError }] = useMutation<{ updateArea: UpdateAreaReturnType }, UpdateAreaProps>(
    MUTATION_UPDATE_AREA, {
      client: graphqlClient,
      onCompleted: () => {
        setSubmitCount(old => old + 1)
      }
    }
  )

  const { areaName, shortCode, pathTokens, content: { description }, children, climbs, metadata: { lat, lng, leaf: isLeaf }, formRef } = props

  // React-hook-form declaration
  const form = useForm<HtmlFormProps>(
    {
      mode: 'onBlur',
      defaultValues: {
        areaName,
        shortCode,
        latlng: `${lat.toString()},${lng.toString()}`,
        areaType: isLeaf
          ? 'leaf'
          : 'area',
        description
      }
    })

  const { handleSubmit, formState: { isSubmitting, dirtyFields }, reset, getValues } = form

  const submitHandler = async ({ areaName, shortCode, latlng, isDestination, areaType, description }: HtmlFormProps): Promise<void> => {
    const { uuid } = props
    const [latStr, lngStr] = latlng.split(',')

    const doc: Partial<HtmlFormProps> = Object.assign({},
      dirtyFields?.areaName === true ? { areaName: getValues('areaName') } : undefined,
      dirtyFields?.shortCode === true ? { shortCode: getValues('shortCode') } : undefined,
      dirtyFields?.isDestination === true ? { isDestination: getValues('isDestination') } : undefined,
      dirtyFields?.areaType === true && canChangeAreaType ? { isLeaf: getValues('areaType') === 'leaf' } : undefined,
      dirtyFields?.latlng === true ? { ...{ lat: parseFloat(latStr), lng: parseFloat(lngStr) } } : undefined,
      dirtyFields?.description === true ? { description: getValues('description') } : undefined
    )

    const isEmptyDoc = Object.keys(doc).length === 0
    if (isEmptyDoc) {
      toastRef?.current?.publish('Nothing to save.  Please make some edit.')
    } else {
      const rs = await updateArea({
        variables: {
          uuid,
          ...doc
        },
        context: {
          headers: {
            authorization: `Bearer ${session?.data?.accessToken as string ?? ''}`
          }
        }
      })
      if (rs.errors == null) {
        const values = Object.assign({}, doc, dirtyFields?.latlng === true ? { latlng } : undefined)
        console.log('#reset', values)
        reset(values, { keepValues: true })
        toastRef?.current?.publish('Area updated successfully.')
      }
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
    <>
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
          <AreaTypeRadioGroup canEdit={canChangeAreaType} />
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
      <Toast ref={toastRef} />
      {gqlError != null && <SaveErrorAlert {...gqlError} />}
    </>
  // </div>
  )
}
interface ErrorAlertProps {
  message: string
}

export const SaveErrorAlert = ({ message }: ErrorAlertProps): JSX.Element => {
  return (
    <ErrorAlert
      description={
        <span>
          {message}
          <span><br />Click Ok and try again.</span>
        </span>
      }
    />
  )
}

/**
 * A reuseable radio button group for changing area type (area vs crag)
 */
export const AreaTypeRadioGroup = ({ name = 'areaType', canEdit }: { name?: string, canEdit: boolean }): JSX.Element => (
  <RadioGroup
    groupLabel='Area designation'
    groupLabelAlt={<ExplainAreaTypeLock canEdit={canEdit} />}
    name={name}
    disabled={!canEdit}
    labels={[
      'Area',
      'Crag (sport, trad, ice)',
      'Boulder']}
    values={['area', 'crag', 'boulder']}
    labelTips={['Like a folder an area may only contain other smaller areas', 'A crag is where you add rope climbing routes (sport, trad, ice).', 'A boulder may only have boulder problems.']}
  />)

const ExplainAreaTypeLock = ({ canEdit }: { canEdit: boolean }): JSX.Element | null =>
  (
    canEdit
      ? null
      : (
        <div className='tooltip tooltip-left tooltip-info drop-shadow-lg' data-tip='Selections become read-only when the area contains subareas or is a crag/boulder.'>
          <QuestionMarkCircleIcon className='text-info w-5 h-5' />
        </div>)
  )
