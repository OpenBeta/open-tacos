
// const router = jest.createMockFromModule(require('next/router'))

export function useRouter () {
  return {
    route: '/',
    pathname: '',
    query: '',
    asPath: ''
  }
}
