import jest from '@types/jest'

export function useRouter () {
  return {
    route: '/',
    pathname: '/',
    query: '',
    asPath: '/',
    replace: replaceFn,
    push: pushFn,
    beforePopState: jest.fn(),
    back: jest.fn()
  }
}

export const pushFn = jest.fn()
export const replaceFn = jest.fn()
