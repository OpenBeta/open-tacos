import { useRouter } from 'next/router'

/**
 * Get or set canary session flag
 * @returns true if user requests a page with ?next=true
 */
export default function useCanary (): boolean {
  if (typeof localStorage === 'undefined') {
    return false
  }
  const router = useRouter()
  const isNext = router.query.next // url contains ?next=true
  if (typeof isNext === 'string') {
    if (isNext === 'true') {
      localStorage.setItem('canary', 'true')
      return true
    } else {
      localStorage.setItem('canary', 'false')
      return false
    }
  }
  return localStorage.getItem('canary') === 'true'
}
