'use client';

import { FlightDestination } from '@/types/FlightDestination';
import Bounded from './Bounded';
import Calender from './Calender';
import { FormEvent, Fragment, useEffect, useMemo, useState } from 'react';
import DropDown from './Input/Dropdown';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, getDay, isValid } from 'date-fns';
import DatePicker from './Input/DatePicker';
import RadioButton from './Input/RadioButton';
import { Dialog, Transition } from '@headlessui/react';
import FormModal from './FormModal';
export interface AirlineFormProps {
  destinations: FlightDestination[];
}

const BOOKING_URL = ' https://eo5eo2dqy2y0ds6.m.pipedream.net';

const FLIGHT_TYPES = [
  {
    label: 'Roundtrip',
    value: 'roundtrip',
  },
  {
    label: 'One-way',
    value: 'one-way',
  },
];

export const AirlineForm = ({ destinations }: AirlineFormProps) => {
  const router = useRouter();

  const [IsLoading, setIsLoading] = useState(false);
  const [SuccessMessage, setSuccessMessage] = useState<string | null>(null);
  const [ErrorMessage, setErrorMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const SelectedOriginCode = searchParams.get('origin') ?? destinations[0].code;
  const SelectedDestinationCode =
    searchParams.get('destination') ?? destinations[0].code;
  const departureDate =
    searchParams.get('departureDate') ?? format(new Date(), 'yyyy-MM-dd');
  const returnDate =
    searchParams.get('returnDate') ?? format(new Date(), 'yyyy-MM-dd');
  const flightType = searchParams.get('type') ?? FLIGHT_TYPES[0].value;

  const formatDestinationOptions = useMemo(
    () =>
      destinations.map((destination) => ({
        label: destination.city,
        value: destination.code,
      })),
    [destinations]
  );
  const OriginCity = useMemo(() => {
    const selectedCode = formatDestinationOptions.find(
      (des) => des.value === SelectedOriginCode
    );
    if (selectedCode) {
      return selectedCode.label;
    }
    return formatDestinationOptions[0].label;
  }, [formatDestinationOptions, SelectedOriginCode]);

  const DestinationCity = useMemo(() => {
    const selectedCode = formatDestinationOptions.find(
      (des) => des.value === SelectedDestinationCode
    );
    if (selectedCode) {
      return selectedCode.label;
    }
    return formatDestinationOptions[3].label;
  }, [formatDestinationOptions, SelectedDestinationCode]);

  const updateParamUrl = (newValue: string, newValueKey: string) => {
    const searchParams: Record<string, string> = {
      origin: SelectedOriginCode,
      destination: SelectedDestinationCode,
      type: flightType,
      departureDate,
    };

    if (Object.keys(searchParams).includes(newValueKey)) {
      searchParams[newValueKey as keyof typeof searchParams] = newValue;
    }

    if (searchParams.type === 'roundtrip') {
      searchParams['returnDate'] = returnDate;
    }

    const params = new URLSearchParams(searchParams).toString();

    // use replace to prevent adding history
    router.replace(`?${params}`);
  };

  const handleChangeOrigin = (newValue: string) => {
    updateParamUrl(newValue, 'origin');
  };
  const handleChangeDestination = (newValue: string) => {
    updateParamUrl(newValue, 'destination');
  };

  const handleDeparatureDateChange = (newDate: Date) => {
    updateParamUrl(format(newDate, 'yyyy-MM-dd'), 'departureDate');
  };
  const handleReturnDateChange = (newDate: Date) => {
    updateParamUrl(format(newDate, 'yyyy-MM-dd'), 'returnDate');
  };

  const handleFlightTypeChange = (newValue: string) => {
    updateParamUrl(newValue, 'type');
  };

  const checkAvailability = (date: string, AirportCode: string) => {
    const dateObject = new Date(date);
    if (!isValid(dateObject)) {
      throw new Error(`Invalid input date`)
    };
    const dayOfWeek = getDay(dateObject);
    const selectedAirport = destinations.find(des => des.code === AirportCode);
    if (!selectedAirport) {
      throw new Error(`${AirportCode} is invalid code`)
    }
    return selectedAirport.availableWeekdays.includes(dayOfWeek);
  }

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true)
      const body: Record<string, string> = {
        origin: SelectedOriginCode,
        destination: SelectedDestinationCode,
        type: flightType,
        departureDate,
      };

      const availableForDeparate = checkAvailability(departureDate, SelectedOriginCode)

      if (!availableForDeparate) {
        throw new Error(`Flight not available on ${departureDate} from ${OriginCity}`)
      }

      if (flightType === 'roundtrip') {
        body['returnDate'] = returnDate;
        const availableForReturn = checkAvailability(returnDate, SelectedDestinationCode)
        if (!availableForReturn) {
          throw new Error(`Flight not available on ${returnDate} from ${DestinationCity}`)
        }
      }

      const result = await fetch(BOOKING_URL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      }).then((res) => res.json());

      setSuccessMessage(`Flight booked with Id ${result.bookingId} for ${format(new Date(result.timestamp), "iii, MMM yyyy")}`)
    } catch (error) {
      console.log(error);
      if (
        typeof error === 'object' &&
        error && "message" in error &&
        typeof error.message === 'string'
      ) {
        setErrorMessage(error.message)
      }
      if (typeof error === 'string') {
        setErrorMessage(error)
      }
    } finally {
      setIsLoading(false)
    }
  };

  const resetSuccessAndError = () => {
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  return (
    <Bounded>
      <h1 className='font-body font-bold text-xl text-center'>
        Welcome to the Digido Airlines!
      </h1>
      <form className='mt-10 flex justify-center' onSubmit={handleSubmitForm}>
        <div className=' w-full md:w-auto'>
          <div className='flex flex-col md:flex-row gap-14 py-4 mb-5'>
            <DropDown
              value={OriginCity}
              label='Origin'
              options={formatDestinationOptions}
              onValueChange={handleChangeOrigin}
            />
            <DropDown
              value={DestinationCity}
              label='Destination'
              options={formatDestinationOptions}
              onValueChange={handleChangeDestination}
            />
          </div>
          <div className='flex flex-col md:flex-row gap-14 py-4 mb-14'>
            <DatePicker
              value={departureDate}
              format='dd/MM/yyyy'
              label='From'
              onChange={handleDeparatureDateChange}
            />
            <DatePicker
              value={returnDate}
              format='dd/MM/yyyy'
              label='To'
              onChange={handleReturnDateChange}
              disabled={flightType === 'one-way'}
            />
          </div>
          <div className='mb-10'>
            <RadioButton
              options={FLIGHT_TYPES}
              onChange={handleFlightTypeChange}
              value={flightType}
            />
          </div>
          <button aria-disabled={IsLoading} className='bg-primary-500 aria-disabled:opacity-50 py-4 px-8 text-white text-center rounded-3xl'>
            Book Flight
          </button>
        </div>
      </form>
      <FormModal
        title={SuccessMessage ? 'Booking successful' : 'Booking Failed'}
        isOpen={SuccessMessage !== null || ErrorMessage !== null}
        close={resetSuccessAndError}
        message={SuccessMessage ?? ErrorMessage}
      />
    </Bounded>
  );
};
