import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import Link from 'next/link'
import clx from 'classnames'
import { signIn, useSession } from 'next-auth/react'
import { CheckBadgeIcon } from '@heroicons/react/24/outline'

import { AddAreaReturnType } from '../../js/graphql/gql/contribs'
import { SuccessAlert, AlertAction, ErrorAlert } from './alerts/Alerts'
import Input from '../ui/form/Input'
import useUpdateAreasCmd from '../../js/hooks/useUpdateAreasCmd'

export interface AddAreaFormProps {
  parentUuid: string
  parentName: string
  onSuccess?: () => void
}

type ProgressState = 'initial' | 'data-entry' | 'confirm'

/**
 * Add child area wizard
 */
export default function AddAreaForm ({ parentName, parentUuid, onSuccess }: AddAreaFormProps): JSX.Element {
  const session = useSession()
  const [step, setStep] = useState<ProgressState>('initial')
  const [newArea, setNewArea] = useState<AddAreaReturnType>()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
    if (session.status === 'authenticated') {
      setStep('data-entry')
    }
  }, [session])

  const onAddSuccessHandler = (data): void => {
    setNewArea(data.addArea)
    setStep('confirm')
    if (onSuccess != null) onSuccess()
  }

  return (
    <div className='dialog-form-default'>
      {session.status !== 'authenticated' && <div>Checking authorization...</div>}
      {step === 'data-entry' &&
        <Step1
          parentName={parentName}
          parentUuid={parentUuid}
          onSuccess={onAddSuccessHandler}
        />}
      {step === 'confirm' &&
        <Step2
          areaId={newArea?.uuid ?? ''}
          areaName={newArea?.areaName ?? ''}
          onAddMore={() => setStep('data-entry')}
        />}
    </div>
  )
}
export interface ChildAreaBaseProps {
  parentUuid: string
  parentName: string
  formRef?: any
  onSuccess: (data) => void
}

interface NewAreaFormProps extends ChildAreaBaseProps {
  newAreaName: string
  shortCode: string
}

function Step1 ({ parentUuid, parentName, onSuccess }: ChildAreaBaseProps): JSX.Element {
  const session = useSession()

  const { addOneAreaCmd } = useUpdateAreasCmd({
    areaId: parentUuid,
    accessToken: session?.data?.accessToken as string ?? '',
    onAddCompleted: onSuccess
  })

  // Form declaration
  const form = useForm<NewAreaFormProps>({
    mode: 'onBlur',
    defaultValues: { newAreaName: '', shortCode: '', parentName: parentName }
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  const submitHandler = async ({ newAreaName }: NewAreaFormProps): Promise<void> => {
    await addOneAreaCmd({ name: newAreaName, parentUuid })
  }

  return (
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

interface Step2Props {
  areaId: string
  areaName: string
  onAddMore: () => void
}

const Step2 = ({ areaId, areaName, onAddMore }: Step2Props): JSX.Element => {
  return (
    <div className='fadeinEffect flex flex-col items-center gap-4'>
      <CheckBadgeIcon className='stroke-success w-10 h-10' />
      <div>Area&nbsp;
        <AreaPageResolver uuid={areaId}>
          <span className='font-semibold link-accent'>
            {areaName}
          </span>
        </AreaPageResolver> added.  Thank you for your contribution!
      </div>
      <div className='flex items-center gap-2'>
        <button type='button' className='btn btn-solid btn-wide' onClick={onAddMore}>Add more</button>
        <AreaPageResolver uuid={areaId}>
          <button className='btn btn-link'>View area</button>
        </AreaPageResolver>
      </div>
    </div>
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
