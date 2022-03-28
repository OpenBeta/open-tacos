import ReactPaginate from 'react-paginate'
import { actions, store, ITEMS_PER_PAGE } from '../../js/stores'

/**
 * Pagination control
 */
const Pagination = (): JSX.Element => {
  const { pageCount, currentPage, itemOffset } = store.filters.pagination()
  const total = store.filters.total()
  return (
    <div className='my-8 flex flex-col items-center justify-center space-y-4'>
      <ReactPaginate
        className='flex space-x-4 items-center justify-center'
        pageClassName='hover:bg-slate-200 rounded-full'
        pageLinkClassName='h-10 w-10 rounded-full flex justify-center items-center'
        activeLinkClassName='bg-slate-800 mix-blend-darken text-white'
        breakLabel='...'
        nextLabel='>'
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        previousClassName={`${currentPage === 0 ? 'pointer-events-none text-tertiary' : ''}`}
        previousLabel='<'
        nextClassName={`${currentPage < pageCount - 1 ? '' : 'pointer-events-none text-tertiary'}`}
        renderOnZeroPageCount={null}
        forcePage={currentPage}
      />
      <Footer
        total={total}
        itemOffset={itemOffset}
        itemsInView={currentPage < pageCount - 1 ? itemOffset + ITEMS_PER_PAGE : total}
      />
    </div>
  )
}
export default Pagination

const handlePageClick = ({ selected }: { selected: number }): void => {
  window.scrollTo({ top: 0, behavior: 'auto' })
  actions.filters.toPage(selected)
}

interface FooterProps {
  itemOffset: number
  itemsInView: number
  total: number
}

const Footer = ({ itemOffset, total, itemsInView }: FooterProps): JSX.Element => (
  <div className='text-sm text-secondary'>
    {itemOffset + 1} &#8211; {itemsInView} of {total} crags to climb
  </div>
)
