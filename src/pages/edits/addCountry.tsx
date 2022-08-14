import { NextPage } from 'next'
import { useState } from 'react'
import CountryList, { OnSelectProps } from '../../components/search/CountryList'
import { Button, ButtonVariant } from '../../components/ui/BaseButton'

const AddNewCountryPage: NextPage<{}> = () => {
  const [country, setCountry] = useState<OnSelectProps>()
  return (
    <div data-theme='light' className='card lg:card-side bg-base-100 h-screen'>
      <h1>Add a country</h1>
      <ul className='steps steps-vertical lg:steps-horizontal'>
        <li className='step step-primary'>
          <CountryList onSelect={setCountry} placeholder={country?.official} />
        </li>
        <li className='step'>
          <Button
            label='Submit'
            variant={ButtonVariant.SOLID_DEFAULT}
            onClick={() => {
              window.alert(`Adding ${country?.isoCode ?? ''}`)
            }}
          />
        </li>
      </ul>

    </div>
  )
}

export default AddNewCountryPage
