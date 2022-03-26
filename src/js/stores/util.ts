import { AreaType } from '../types'

interface CalculatePaginationProps {
  itemOffset: number
  itemsPerPage: number
  whole: AreaType[]
}

interface NextPaginationProps {
  currentItems: AreaType[]
  pageCount: number
  itemOffset: number
  currentPage: number
}

export const calculatePagination = (
  { itemOffset, itemsPerPage, whole }: CalculatePaginationProps): NextPaginationProps => {
  const endOffset = itemOffset + itemsPerPage
  const currentItems = whole.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(whole.length / itemsPerPage)
  const currentPage = Math.round(itemOffset / itemsPerPage)
  return {
    currentItems,
    pageCount,
    itemOffset,
    currentPage
  }
}
