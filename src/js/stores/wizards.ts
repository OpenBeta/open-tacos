import { createStore, mapValuesKey } from '@udecode/zustood'

// import produce from 'immer'

interface AddCountryProps {
  isoCode: string | undefined
  official: string | undefined
  steps: boolean[]
}

interface AddAreaProps {
  name: string
  shortCode?: string
  refContext: string
  refContextData: {
    latlng: number[]
    countryCode: string
  }
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
  name: '',
  refContext: '',
  refContextData: {
    latlng: [0, 0],
    countryCode: ''
  },
  refAreaName: '',
  refAreaData: '',
  steps: [false, false, false]
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
    recordStep1a: (name: string, lnglat: number[], countryCode: string) => {
      api.set.state(draft => {
        draft.refContext = name
        draft.refContextData = {
          latlng: [lnglat[1], lnglat[0]],
          countryCode: countryCode
        }
        draft.steps[0] = true
      })
    },
    resetLocation: () => {
      api.set.state(draft => {
        draft.refContext = ''
        draft.refContextData = {
          latlng: [0, 0],
          countryCode: ''
        }
        draft.steps[0] = false
        // also reset step 2
        draft.refAreaName = ''
        draft.refAreaData = ''
      })
    }
  }))
  .extendActions((set, get, api) => ({
    recordStep1b: (name: string, data: string) => {
      api.set.state(draft => {
        draft.refAreaName = name
        draft.refAreaData = data
      })
    },
    resetStep1b: () => {
      api.set.state(draft => {
        draft.refAreaName = ''
        draft.refAreaData = ''
      })
    },
    recordStep2: (complete: boolean) => {
      api.set.state(draft => {
        draft.steps[1] = complete
      })
    },
    recordStepFinal: () => {
      api.set.state(draft => {
        draft.steps[2] = true
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
