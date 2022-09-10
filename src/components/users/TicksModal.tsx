import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import TickCard from './TickCard'

export default function TicksModal ({ open, setOpen, setOpenForm, climbName, ticks }): JSX.Element {
  const cancelButtonRef = useRef(null)

  function openFormCloseModal (): void {
    setOpen(false)
    setOpenForm(true)
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                <div>
                  <div className='text-center sm:mt-5'>
                    <Dialog.Title as='h3' className='text-lg font-medium pb-4 leading-6 text-gray-900'>
                      Ticks for {climbName}
                    </Dialog.Title>
                    <div className='mt-2'>
                      {ticks?.map((tick, idx) => {
                        return <TickCard key={idx} dateClimbed={tick.dateClimbed} notes={tick.notes} style={tick.style} />
                      })}
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
                  <button
                    type='button'
                    className='inline-flex w-full justify-center p-2 border-2 rounded-xl border-ob-primary transition
                    text-ob-primary hover:bg-ob-primary hover:ring hover:ring-ob-primary ring-offset-2
                    hover:text-white font-bold sm:col-start-2 sm:text-sm'
                    onClick={() => openFormCloseModal()}
                  >
                    Add another tick
                  </button>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-xl border border-ob-primary bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ob-primary focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm'
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Exit
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
