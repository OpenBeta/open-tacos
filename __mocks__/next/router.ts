export function useRouter (): any {
  return {
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    replace: replaceFn,
    push: pushFn,
    beforePopState: jest.fn(),
    back: jest.fn()
  }
}

export function usePathname (): any {
  return '/'
}

export function useSearchParams (): any {
  return new URLSearchParams()
}

export const pushFn = jest.fn()
export const replaceFn = jest.fn()
