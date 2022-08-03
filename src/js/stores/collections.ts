import { createStore, CreateStoreOptions, StateStorage } from '@udecode/zustood'
import produce from 'immer'

import { loadCollections } from '../userApi/user'
interface UserCollectionsStateProps {
  status: 'loading' | 'loaded' | 'init'
  areaCollections: {
    favourites: string[]
  }
  climbCollections: {
    favourites: string[]
  }
}

export const INITIAL_STATE: UserCollectionsStateProps = {
  status: 'init',
  areaCollections: {
    favourites: []
  },
  climbCollections: {
    favourites: []
  }
}

const storage: StateStorage = {
  getItem: async (name: string): Promise<string> => {
    const cols = await loadCollections()
    console.log('loaing ', name, ' from the backend', cols)
    return JSON.stringify({ state: cols })
  },
  setItem: async (name: string, value: any): Promise<void> => {
    console.log(name, 'with value', value, 'has been saved')
    // Todo: save to Auth0
  }
}

const STORE_OPTS: CreateStoreOptions<UserCollectionsStateProps> = {
  persist: {
    enabled: true,
    name: 'auth0',
    getStorage: () => storage,
    partialize: (state) => ({ climbCollections: state.climbCollections })
  }
}

export const userCollectionsStore = createStore('userCollections')(INITIAL_STATE, STORE_OPTS)
  .extendActions((set, get, api) => ({
    load: async (uuid: string) => {

    }
  })).extendActions((set, get, api) => ({
    addClimb: (uuid: string) => {
      const nextState = produce(get.climbCollections(), draft => {
        draft.favourites.push(uuid)
      })
      set.climbCollections(nextState)
    }
  }))
