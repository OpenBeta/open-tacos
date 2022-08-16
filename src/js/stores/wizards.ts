import { createStore, mapValuesKey } from '@udecode/zustood'

// import produce from 'immer'

interface AddCountryProps {
  isoCode: string | undefined
  official: string | undefined
  steps: boolean[]
}

interface AddAreaProps {
  name?: string
  shortCode?: string
  refName: string
  refData: string | number[]
  relationToRef?: 'in' | 'near'
  steps: boolean[]
}

const INITIAL_COUNTRY_STATE: AddCountryProps = {
  isoCode: undefined,
  official: undefined,
  steps: [false]
}

const INITIAL_AREA_STATE: AddAreaProps = {
  refName: '',
  refData: '',
  steps: [false, false]
}

const STORE_OPTS = {}

export const addCountryStore = createStore('addCountry')(INITIAL_COUNTRY_STATE, STORE_OPTS)
  .extendActions((set, get, api) => ({
    recordStep1: (state: any, solved: boolean) => {
      set.isoCode(state.isoCode)
      set.official(state.official)
      set.steps([true])
    }
  }))

export const addAreaStore = createStore('addArea')(INITIAL_AREA_STATE, STORE_OPTS)
  .extendActions((set, get, api) => ({
    recordStep1a: (name: string, data: string | number[]) => {
      api.set.state(draft => {
        draft.refName = name
        draft.refData = data
        draft.steps[0] = true
      })
    }
  }))

// Global store
export const rootStore = {
  addCountryStore: addCountryStore,
  addAreaStore: addAreaStore
}

// Global hook selectors
/* eslint-disable-next-line */
export const useWizardStore = () => mapValuesKey('use', rootStore)

// Global getter selectors
export const wizardStore = mapValuesKey('get', rootStore)

// Global actions
export const wizardActions = mapValuesKey('set', rootStore)
