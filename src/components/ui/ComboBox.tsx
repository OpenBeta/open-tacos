import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'

function classNames (...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

export interface ValueObj{
  id: number
  name: string
  disabled?: boolean
}

interface ComboBoxSingleProps {
  options: ValueObj[]
  value: ValueObj
  onChange: (value: ValueObj) => void
  label: string
  selectClassName?: string
}
interface ComboBoxMultiProps {
  options: ValueObj[]
  value: ValueObj[]
  onChange: (value: ValueObj[]) => void
  label: string
  multiple: true
  selectClassName?: string
}
type ComboBoxProps = ComboBoxSingleProps | ComboBoxMultiProps

export default function ComboBox (props: ComboBoxProps): JSX.Element {
  const { options, value, onChange, label, selectClassName = '' } = props
  return (
    <Listbox value={value} onChange={onChange} multiple={'multiple' in props ? props.multiple : false}>
      {({ open }) => (
        <>
          {label !== '' && <Listbox.Label className='block text-sm font-medium text-gray-700 mt-2'>{label}</Listbox.Label>}
          <div className='mt-1 relative'>
            <Listbox.Button className={selectClassName !== '' ? selectClassName : SELECT_DEFAULT_CSS}>
              <span className='block truncate'>{Array.isArray(value) ? value.map(valueObj => valueObj.name).join(', ') : value.name}</span>
              {selectClassName === '' && // Set icon by className
                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                  <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </span>}
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
                {options.map((type) => (
                  <Listbox.Option
                    key={type.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-8 pr-4'
                      )}
                    value={type}
                    disabled={type.disabled}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {type.name}
                        </span>

                        {selected
                          ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 left-0 flex items-center pl-1.5'
                              )}
                            >
                              <CheckIcon className='h-5 w-5' aria-hidden='true' />
                            </span>
                            )
                          : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}

const SELECT_DEFAULT_CSS = 'relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
