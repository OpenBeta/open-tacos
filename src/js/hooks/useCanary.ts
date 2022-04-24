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
  if (typeof isNext === 'string' && Boolean(isNext)) {
    sessionStorage.setItem('canary', 'true')
    return true
  }
  return Boolean(sessionStorage.getItem('canary'))
}
