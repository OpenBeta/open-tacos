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
  refContext: string
  refContextData: number[]
  refAreaName: string
  refAreaData: string
  relationToRef?: 'in' | 'near'
  steps: boolean[]
}

const INITIAL_COUNTRY_STATE: AddCountryProps = {
  isoCode: undefined,
  official: undefined,
  steps: [false]
}

const INITIAL_AREA_STATE: AddAreaProps = {
  refContext: '',
  refContextData: [0, 0],
  refAreaName: '',
  refAreaData: '',
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
    recordStep1a: (name: string, data: number[]) => {
      api.set.state(draft => {
        draft.refContext = name
        draft.refContextData = [data[1], data[0]]
        draft.steps[0] = true
      })
    }
  }))
  .extendActions((set, get, api) => ({
    recordStep2: (name: string, data: string) => {
      api.set.state(draft => {
        draft.refAreaName = name
        draft.refAreaData = data
        draft.steps[1] = true
      })
    },
    resetStep2: () => {
      api.set.state(draft => {
        draft.refAreaName = ''
        draft.refAreaData = ''
        draft.steps[1] = false
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
