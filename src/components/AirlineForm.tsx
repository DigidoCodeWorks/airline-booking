'use client';

import { FlightDestination } from "@/types/FlightDestination";
import Bounded from "./Bounded";
import Calender from "./Calender";
import { useEffect, useMemo, useState } from "react";
import DropDown from "./Input/Dropdown";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
export interface AirlineFormProps {
  destinations: FlightDestination[];
}

export const AirlineForm = ({ destinations }: AirlineFormProps) => {
  const searchParams = useSearchParams();
  const SelectedOriginCode = searchParams.get('origin') ?? destinations[0].code;
  const SelectedDestinationCode = searchParams.get('destination') ?? destinations[0].code;
  const departureDate = searchParams.get('departureDate') ?? format(new Date, "yyyy-MM-dd");
  const returnDate = searchParams.get('returnDate') ?? format(new Date, "yyyy-MM-dd");
  const router = useRouter();

  const formatDestinationOptions = useMemo(() => destinations.map(destination => ({
    label: destination.country,
    value: destination.code
  })), [destinations])
  const OriginCountry = useMemo(() => {
    const selectedCode = formatDestinationOptions.find((des) => des.value === SelectedOriginCode);
    if (selectedCode) {
      return selectedCode.label
    }
    return formatDestinationOptions[0].label
  }, [formatDestinationOptions, SelectedOriginCode])
  const DestinationCountry = useMemo(() => {
    const selectedCode = formatDestinationOptions.find((des) => des.value === SelectedDestinationCode);
    if (selectedCode) {
      return selectedCode.label
    }
    return formatDestinationOptions[3].label
  }, [formatDestinationOptions, SelectedDestinationCode])

  const updateParamUrl = (newValue: string, newValueKey: string) => {
    const searchParams = {
      origin: SelectedOriginCode,
      destination: SelectedDestinationCode,
      departureDate,
      returnDate
    }

    if (Object.keys(searchParams).includes(newValueKey)) {
      searchParams[newValueKey as keyof typeof searchParams] = newValue
    }
    const params = new URLSearchParams(searchParams).toString()
    router.replace(`?${params}`)
  }

  const handleChangeOrigin = (newValue: string) => {
    updateParamUrl(newValue, 'origin')
  }
  const handleChangeDestination = (newValue: string) => {
    updateParamUrl(newValue, 'destination')
  }

  return (
    <Bounded>
      <h1 className="font-body font-bold text-xl text-center">
        Welcome to the Digido Airlines!
      </h1>
      <form className="mt-10 flex justify-center" action="">
        <div>
          <div className="flex gap-14">
            <DropDown
              value={OriginCountry}
              label="Origin"
              options={formatDestinationOptions}
              onValueChange={handleChangeOrigin}
            />
            <DropDown
              value={DestinationCountry}
              label="Destination"
              options={formatDestinationOptions}
              onValueChange={handleChangeDestination}
            />
          </div>
          {/* <Calender month={FromDate} onSelectedDate={handleChangeFromDate} /> */}
        </div>
      </form>
    </Bounded>
  );
};
