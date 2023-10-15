import { RadioGroup } from '@headlessui/react'
import React from 'react'

type Props = {
    value: string;
    onChange: (newValue: string) => void;
    options: {
        value: string;
        label: string;
    }[];
    label?: string
}

const RadioButton = ({ value, onChange, options, label }: Props) => {
    return (
        <RadioGroup value={value} className={'flex gap-4'} onChange={onChange}>
            {label &&
                <RadioGroup.Label>{label}</RadioGroup.Label>
            }
            {options.map(option => (
                <RadioGroup.Option key={option.value} value={option.value}>
                    {({ checked }) => (
                        <div className="cursor-pointer flex items-center gap-2">
                            <div className=' w-8 h-8 rounded-full border-2 border-[#024] flex justify-center items-center'>
                                {checked &&
                                    <div className='w-4 h-4 rounded-full bg-[#024]' />
                                }
                            </div>
                            <span >{option.label}</span>
                        </div>
                    )}
                </RadioGroup.Option>
            ))}

        </RadioGroup>
    )
}

export default RadioButton