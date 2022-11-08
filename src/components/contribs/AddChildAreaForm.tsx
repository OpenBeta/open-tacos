import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import Link from 'next/link'
import clx from 'classnames'
import { useMutation } from '@apollo/client'
import { signIn, useSession } from 'next-auth/react'

import { MUTATION_ADD_AREA, AddAreaReturnType, AddAreaProps } from '../../js/graphql/gql/contribs'
import { SuccessAlert, AlertAction, ErrorAlert } from './alerts/Alerts'
import { graphqlClient } from '../../js/graphql/Client'
import Input from '../ui/form/Input'

export interface ChildAreaBaseProps {
  parentUuid: string
  parentName: string
  formRef: any
}

interface NewAreaFormProps extends ChildAreaBaseProps {
  newAreaName: string
  shortCode: string
}

export default function Form ({ parentUuid, parentName, formRef }: ChildAreaBaseProps): JSX.Element {
  const session = useSession()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
  }, [session])

  // Track submit count
  // react-hook-form has a similar prop but it gets reset when we call the form `reset()`
  const [submitCount, setSubmitCount] = useState(0)

  const [addArea, { error, data }] = useMutation<{ addArea: AddAreaReturnType }, AddAreaProps>(
    MUTATION_ADD_AREA, {
      client: graphqlClient,
      onCompleted: (data) => {
        setSubmitCount(old => old + 1)
        void fetch(`/api/revalidate?a=${data.addArea.uuid}`) // build new area page
        void fetch(`/api/revalidate?a=${parentUuid}`) // rebuild parent page
      }
    }
  )

  // Form declaration
  const form = useForm<NewAreaFormProps>(
    {
      mode: 'onBlur',
      defaultValues: { newAreaName: '', shortCode: '', parentName: parentName }
    })

  const { handleSubmit, formState: { isSubmitSuccessful, isSubmitting }, reset } = form

  const submitHandler = async ({ newAreaName }: NewAreaFormProps): Promise<void> => {
    await addArea({
      variables: {
        name: newAreaName,
        parentUuid: parentUuid,
        countryCode: null
      },
      context: {
        headers: {
          authorization: `Bearer ${session?.data?.accessToken as string ?? ''}`
        }
      }
    })
  }

  const resetFormHandler = (): void => {
    reset()
  }

  useEffect(() => {
    formRef.current = submitCount
  }, [submitCount])

  if (session.status !== 'authenticated') {
    return (
      <div>Checking authorization...</div>
    )
  }
  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Input
            label='Parent:'
            name='parentName'
            disabled
          />
          <Input
            label='Name: *'
            name='newAreaName'
            placeholder='New area name'
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
          />
          <button
            className={
            clx('mt-4 btn btn-primary w-full',
              isSubmitting ? 'loading btn-disabled' : ''
            )
          }
            type='submit'
          >Add area
          </button>
        </form>
      </FormProvider>
      {isSubmitSuccessful && error == null && data != null &&
        <AddSucessAlert {...data.addArea} onContinue={resetFormHandler} />}
      {error != null && <AddErrorAlert {...error} />}
    </>
  )
}

interface SuccessAlertProps extends AddAreaReturnType {
  onContinue: () => void
}
export const AddSucessAlert = ({ areaName, uuid, onContinue }: SuccessAlertProps): JSX.Element => {
  return (
    <SuccessAlert
      description={
        <span>Area&nbsp;
          <AreaPageResolver uuid={uuid}>
            <span className='font-semibold link-accent'>
              {areaName}
            </span>
          </AreaPageResolver> added.  Thank you for your contribution!
        </span>
      }
    >
      <AlertAction className='btn btn-solid btn-sm' onClick={onContinue}>
        Add more
      </AlertAction>
      <AreaPageResolver uuid={uuid}>
        <button className='btn btn-outline btn-sm'>View area</button>
      </AreaPageResolver>
    </SuccessAlert>
  )
}

interface AreaPageResolverProps {
  uuid: string
  children: JSX.Element
}

const AreaPageResolver = ({ uuid, children }: AreaPageResolverProps): JSX.Element => {
  return (
    <Link href={`/areas/${uuid}`}>
      <a target='_blank' rel='noreferrer' onClick={e => e.stopPropagation()}>{children}</a>
    </Link>
  )
}

interface ErrorAlertProps {
  message: string
}

export const AddErrorAlert = ({ message }: ErrorAlertProps): JSX.Element => {
  return (
    <ErrorAlert
      description={
        <span>
          {friendlifyErrorMesage(message)}
          <span><br />Click Ok and try again.</span>
        </span>
      }
    />
  )
}

const friendlifyErrorMesage = (msg: string): string => {
  console.log('#error', msg)
  if (msg.startsWith('E11000')) {
    return 'An area with the same name already exists.'
  }
  // TODO:  account for other errors?
  return msg
}
