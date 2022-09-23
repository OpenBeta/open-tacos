import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import clx from 'classnames'
import { useMutation } from '@apollo/client'
import { signIn, useSession } from 'next-auth/react'

import { MUTATION_UPDATE_AREA, UpdateAreaReturnType, UpdateAreaProps } from '../../js/graphql/contribGQL'
import { ErrorAlert } from './alerts/Alerts'
import { graphqlClient } from '../../js/graphql/Client'
import Input from '../ui/form/Input'
import Toast from '../ui/Toast'
import { AreaType, AreaUpdatableFieldsType } from '../../js/types'

export interface ChildAreaBaseProps {
  areaUuid: string
  areaName: string
}

interface HtmlFormProps extends AreaUpdatableFieldsType {
  latlng: string
}

export default function AreaEditForm (props: AreaType): JSX.Element {
  const session = useSession()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
  }, [session])

  const [updateArea, { error }] = useMutation<{ updateArea: UpdateAreaReturnType }, UpdateAreaProps>(
    MUTATION_UPDATE_AREA, {
      client: graphqlClient
    }
  )

  const { areaName, shortCode, metadata: { lat, lng } } = props
  // Form declaration
  const form = useForm<HtmlFormProps>(
    {
      mode: 'onBlur',
      defaultValues: { areaName, shortCode, latlng: `${lat.toString()},${lng.toString()}` }
    })

  const { handleSubmit, formState: { isSubmitting, isSubmitSuccessful, dirtyFields }, reset, getValues } = form

  const submitHandler = async ({ areaName, shortCode, latlng, isDestination, description }: HtmlFormProps): Promise<void> => {
    const { uuid } = props
    const [latStr, lngStr] = latlng.split(',')

    const doc: Partial<HtmlFormProps> = Object.assign({},
      dirtyFields?.areaName === true ? { areaName: getValues('areaName') } : undefined,
      dirtyFields?.shortCode === true ? { shortCode: getValues('shortCode') } : undefined,
      dirtyFields?.isDestination === true ? { isDestination: getValues('isDestination') } : undefined,
      dirtyFields?.description === true ? { isDestination: getValues('description') } : undefined,
      dirtyFields?.latlng === true ? { ...{ lat: parseFloat(latStr), lng: parseFloat(lngStr) } } : undefined
    )

    await updateArea({
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
  }

  if (session.status !== 'authenticated') {
    return (
      <div>Checking authorization...</div>
    )
  }

  const MIN2PATTERN = /^[a-zA-Z0-9]*$/
  const LATLNG_PATTERN = /(?<lat>^[-+]?(?:[1-8]?\d(?:\.\d+)?|90(?:\.0+)?))\s*,\s*(?<lng>[-+]?(?:180(?:\.0+)?|(?:1[0-7]\d|[1-9]?\d)(?:\.\d+)?))$/

  return (
    <>
      <div className='flex justify-end'>
        <button
          className={
            clx('btn btn-outline btn-sm',
              isSubmitting ? 'loading btn-disabled' : ''
            )
            }
          onClick={() => reset()}
        >Undo changes
        </button>
      </div>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Input
            label='Name:'
            name='areaName'
            placeholder='Area name'
            registerOptions={{
              required: 'Name is required.',
              minLength: {
                value: 2,
                message: 'Minimum 2 characters'
              },
              maxLength: {
                value: 120,
                message: 'Maxium 120 characters'
              }
            }}
            className='input input-primary input-bordered input-md'
          />
          <Input
            label='Short code:'
            name='shortCode'
            placeholder='Short code'
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
            className='input input-primary input-bordered input-md uppercase'
          />
          <Input
            label='Latitude, longtitude:'
            name='latlng'
            placeholder='latitude, longtitude'
            registerOptions={{
              validate: {
                validLatLng:
                (v: string): string | undefined => {
                  if (v.length === 0) return undefined
                  return LATLNG_PATTERN.test(v) ? undefined : 'Invalid coordinates. Ex: 46.433333, 11.85'
                }
              }
            }}
            className='input input-primary input-bordered input-md'
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
      {isSubmitSuccessful && error == null && <Toast title='Area updated successfully' desc='view' />}
      {error != null && <SaveErrorAlert {...error} />}
    </>
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
