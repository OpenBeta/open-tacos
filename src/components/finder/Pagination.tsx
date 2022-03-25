import ReactPaginate from 'react-paginate'
import { actions, store } from '../../js/stores'

/**
 * Pagination control
 */
const Pagination = (): JSX.Element => {
  const { pageCount, currentPage } = store.filters.pagination()
  return (
    <ReactPaginate
      className='my-8 flex space-x-4 items-center justify-center'
      pageClassName='hover:bg-slate-200 rounded-full'
      pageLinkClassName='h-10 w-10 rounded-full flex justify-center items-center'
      activeLinkClassName='bg-slate-800 mix-blend-darken text-white'
      breakLabel='...'
      nextLabel='>'
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      previousClassName={`${currentPage === 0 ? 'pointer-events-none text-slate-200' : ''}`}
      previousLabel='<'
      nextClassName={`${currentPage < pageCount - 1 ? '' : 'pointer-events-none text-slate-400'}`}
      renderOnZeroPageCount={null}
      forcePage={currentPage}
    />
  )
}
export default Pagination

const handlePageClick = ({ selected }: { selected: number }): void => {
  window.scrollTo({ top: 0, behavior: 'auto' })
  actions.filters.toPage(selected)
}
