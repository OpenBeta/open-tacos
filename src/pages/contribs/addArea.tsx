import { useCallback } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import NearAreaPoi from '../../components/search/NearAreaPoi'
import MobileCard from '../../components/ui/MobileCard'
import { useWizardStore } from '../../js/stores/wizards'

const AddAreaPage: NextPage<{}> = () => {
  const router = useRouter()

  const onClose = useCallback(async () => {
    await router.replace('/contribs')
  }, [])

  // const placeholder = useWizardStore().addAreaStore.refLngLat()

  // console.log('#areastore', placeholder)

  return (
    <div data-theme='light' className='h-screen max-w-md mx-auto'>
      <MobileCard title='Add an area/crag or a boulder' onClose={onClose}>
        <ul className='steps step-secondary steps-vertical'>
          <li className='step'>
            <AddAreaStep1 />
          </li>
        </ul>
      </MobileCard>
    </div>
  )
}

// interface AddCountryStepProps {
//   setCountry: (props: OnSelectProps) => void
//   isoCode?: string
//   official?: string
// }

const AddAreaStep1 = (): JSX.Element => {
  const text = useWizardStore().addAreaStore.refName()
  console.log('#Step1', text)
  return (
    <NearAreaPoi placeholder={text} />
  )
}

export default AddAreaPage
