import { Menu, Transition } from '@headlessui/react';
import React, { Fragment } from 'react'

type Props = {
    label: string;
    options: {
        label: string,
        value: string
    }[];
    value: string;
    onValueChange: (newValue: string) => void
}

const DropDown = ({ label, options, value, onValueChange }: Props) => {
    const handleSelectOption = (newValue: string) => {
        onValueChange(newValue)
    }
    return (
        <Menu as="div" className="relative w-full md:w-[233px]">
            <div>
                <Menu.Button className="relative w-full">
                    <label className='text-neutral-50 text-xs absolute px-2 bg-white left-3 -top-2'>
                        {label}
                    </label>
                    <div className='block px-3 py-4 border border-neutral-700 rounded-3xl w-full' >
                        {value}
                    </div>
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-56 p-2 z-50 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-neutral-700 ring-opacity-5 focus:outline-none">
                    {options.map(option => (
                        <Menu.Item key={option.value}>
                            {({ active }) => (
                                <button
                                    onClick={() => handleSelectOption(option.value)}
                                    type='button'
                                    className={`${active ? 'bg-primary-500 text-white' : 'text-neutral-50'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    {option.label}
                                </button>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default DropDown