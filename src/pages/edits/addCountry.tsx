import { NextPage } from 'next'
import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'

import { MUTATION_ADD_COUNTRY } from '../../js/graphql/contribGQL'
import { stagingGraphQLClient } from '../../js/graphql/Client'

import CountryList, { OnSelectProps } from '../../components/search/CountryList'
import { Button, ButtonVariant } from '../../components/ui/BaseButton'
import { wizardActions, useWizardStore, wizardStore } from '../../js/stores/wizards'

const AddNewCountryPage: NextPage<{}> = () => {
  const { addCountryStore } = useWizardStore()
  const [addCountry, { loading, error, data }] = useMutation(
    MUTATION_ADD_COUNTRY, {
      client: stagingGraphQLClient
      // onCompleted: onDeleted
    }
  )
  const session = useSession({ required: true })
  return (
    <div data-theme='light' className='card card-compact bg-base-100 h-screen max-w-md mx-auto'>
      <div className='card-body'>
        <h2>Add a country</h2>
        <ul className='steps steps-vertical'>
          <li className='step step-primary'>
            <AddCountryStep
              isoCode={addCountryStore.isoCode()}
              official={addCountryStore.official()}
              setCountry={country => wizardActions.addCountryStore.recordStep1(country, true)}
            />
          </li>
          <li className='step'>
            <Button
              label={loading ? 'Submitting' : 'Submit'}
              variant={ButtonVariant.SOLID_DEFAULT}
              disabled={loading}
              onClick={async () => {
                console.log(`Adding ${wizardStore.addCountryStore?.official() ?? ''}`)
                const isoCode = wizardStore.addCountryStore?.isoCode()
                if (isoCode != null) {
                  await addCountry({
                    variables: {
                      isoCode
                    },
                    context: {
                      headers: {
                        authorization: `Bearer ${session?.data?.accessToken as string ?? ''}`
                      }
                    }
                  })
                }
              }}
            />
          </li>
        </ul>
        <div className='mt-12'>
          {data != null &&
            <div className='alert alert-success'>
              <div>
                <svg xmlns='http://www.w3.org/2000/svg' className='stroke-current flex-shrink-0 h-8 w-8' fill='none' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
                <span>{data.addCountry.areaName} added successfully!</span>
              </div>
            </div>}
          {error != null &&
            <div className='alert alert-warning'>
              <div>
                <svg xmlns='http://www.w3.org/2000/svg' className='stroke-current flex-shrink-0 h-8 w-8' fill='none' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>
                <span> {error.message}</span>
              </div>
            </div>}
        </div>
      </div>
    </div>
  )
}

interface AddCountryStepProps {
  setCountry: (props: OnSelectProps) => void
  isoCode?: string
  official?: string
}

const AddCountryStep = ({ setCountry, isoCode, official }: AddCountryStepProps): JSX.Element => {
  return (
    <CountryList onSelect={setCountry} placeholder={official} />
  )
}

export default AddNewCountryPage
