import { createStore, mapValuesKey } from '@udecode/zustood'

// import produce from 'immer'

interface AddCountryProps {

  isoCode: string | undefined
  official: string | undefined
  steps: boolean[]
}

const INITIAL_STATE: AddCountryProps = {
  isoCode: undefined,
  official: undefined,
  steps: [false]
}

const STORE_OPTS = {}

export const addCountryStore = createStore('addCountry')(INITIAL_STATE, STORE_OPTS)
  .extendActions((set, get, api) => ({
    recordStep1: (state: any, solved: boolean) => {
      set.isoCode(state.isoCode)
      set.official(state.official)
      set.steps([true])
    }
  }))

// Global store
export const rootStore = {
  addCountryStore: addCountryStore
}

// Global hook selectors
/* eslint-disable-next-line */
export const useWizardStore = () => mapValuesKey('use', rootStore)

// Global getter selectors
export const wizardStore = mapValuesKey('get', rootStore)

// Global actions
export const wizardActions = mapValuesKey('set', rootStore)
