'use client';

import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, getDate, isSameDay, isSameMonth, setMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import React, { useMemo, useState } from 'react'
import Arrow from './Icons/Arrow';

const CalenderHeaders = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
]

type Props = {
    month: Date,
    onMonthChange?: (newDate: Date) => void,
    onSelectedDate?: (newDate: Date) => void,
}

const Calender = ({ month: monthFromProps, onMonthChange, onSelectedDate }: Props) => {
    const [month, setMonth] = useState(monthFromProps)
    const [SelectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleNext = () => {
        const nextDate = startOfMonth(addMonths(month, 1));
        setMonth(nextDate)
        if (onMonthChange) {
            onMonthChange(nextDate)
        }
    }
    const handlePrev = () => {
        const PrevDate = startOfMonth(subMonths(month, 1));
        setMonth(PrevDate)
        if (onMonthChange) {
            onMonthChange(PrevDate)
        }
    }

    const selectDate = (date: Date) => {
        setMonth(date)
        setSelectedDate(date)
        if (onSelectedDate) {
            onSelectedDate(date)
        }
        if (onMonthChange) {
            onMonthChange(date)
        }
    }

    const days = useMemo(
        () =>
            eachDayOfInterval({
                start: startOfWeek(startOfMonth(month)),
                end: endOfWeek(endOfMonth(month)),
            }),
        [month],
    );

    return (
        <div className='p-6 max-w-lg bg-white shadow-[0px_10px_50px_0px_rgba(139,139,139,0.10)] rounded-3xl'>
            <div className='flex justify-between items-center'>
                <button onClick={handlePrev}>
                    <Arrow />
                </button>
                <button>
                    <h5 className='font-semibold'>{format(month, 'MMMM yyyy')}</h5>
                </button>
                <button onClick={handleNext}>
                    <Arrow className=' transform rotate-180' />
                </button>
            </div>
            <div className='grid grid-cols-7 gap-2'>
                {Array(7).fill(0).map((_, index) =>
                    <span
                        className={'py-6 flex justify-center items-center text-neutral-500 text-sm font-semibold'}
                        key={index}
                    >
                        {CalenderHeaders[index]}
                    </span>
                )}
                {days.map((day, index) => (
                    <span
                        key={index}
                        onClick={() => selectDate(day)}
                        aria-disabled={!isSameMonth(day, month)}
                        aria-selected={!!(SelectedDate && isSameDay(SelectedDate, day))}
                        className={'py-4 flex justify-center items-center font-medium cursor-pointer text-neutral-50 aria-selected:text-white aria-selected:bg-primary-500 rounded-3xl aria-disabled:text-neutral-100'}
                    >
                        {getDate(day)}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default Calender