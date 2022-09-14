import { useRouter } from 'next/router'

/**
 * Get or set canary session flag
 * @returns true if user requests a page with ?next=true
 */
export default function useCanary (): boolean {
  if (typeof sessionStorage === 'undefined') {
    return false
  }
  const router = useRouter()
  const isNext = router.query.next // url contains ?next=true
  if (typeof isNext === 'string') {
    if (isNext === 'true') {
      sessionStorage.setItem('canary', 'true')
      return true
    } else {
      sessionStorage.setItem('canary', 'false')
      return false
    }
  }
  return sessionStorage.getItem('canary') === 'true'
}
