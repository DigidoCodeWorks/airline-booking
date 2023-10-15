import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import Calender from '../Calender';
import { format } from 'date-fns';

type Props = {
    value: string;
    label: string;
    onChange: (newDate: Date) => void;
    disabled?: boolean;
    format?: string;
}

const DatePicker = ({ value, onChange, label, disabled = false, format: stringFormat }: Props) => {
    return (
        <Popover aria-disabled={disabled} className="relative aria-disabled:opacity-50 aria-disabled:pointer-events-none w-full md:w-[233px]">
            {({ close }) => (
                <>
                    <Popover.Button
                        className="relative w-full"
                    >
                        <label className='text-neutral-50 text-xs absolute px-2 bg-white left-3 -top-2'>
                            {label}
                        </label>
                        <div className='block px-3 py-4 border border-neutral-700 rounded-3xl w-full' >
                            {stringFormat ? format(new Date(value), stringFormat) : value}
                        </div>
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute left-1/2 z-50 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 ">
                            <Calender
                                month={new Date(value)}
                                onSelectedDate={(date) => {
                                    onChange(date);
                                    close()
                                }} />
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}

export default DatePicker