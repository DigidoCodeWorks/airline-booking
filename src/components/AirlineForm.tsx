"use client";
import React, { useState } from "react";
import { FlightDestination } from "@/types/FlightDestination";
import Bounded from "./Bounded";

export interface AirlineFormProps {
  destinations: FlightDestination[];
}

export const AirlineForm = ({ destinations }: AirlineFormProps) => {
  const [tripType, setTripType] = useState("round-trip");
  return (
    <Bounded
      as="div"
      className="h-screen flex flex-col justify-center items-center"
    >
      <div className="bg-white h-full p-20 flex flex-col space-y-4 rounded-xl justify-center">
        <div className="flex space-x-4 mb-4">
          <div className="w-[12.14vw] relative">
            <label
              htmlFor="origin"
              className="absolute top-[-1em] left-[0.774vw] bg-white px-1 text-sm font-normal"
            >
              Origin
            </label>
            <select
              id="origin"
              className="w-full h-[5.51vh] border-[1.49px] border-[#8B8B8B] outline-none px-[0.774vw] rounded-xl appearance-none text-center"
            >
              {destinations.map((destination) => (
                <option key={destination.code} value={destination.code}>
                  {destination.city}
                </option>
              ))}
            </select>
          </div>

          <div className="w-[12.14vw] relative">
            <label
              htmlFor="destination"
              className="absolute top-[-1em] left-[0.774vw] bg-white px-1 text-sm font-normal"
            >
              Destination
            </label>
            <select
              id="destination"
              className="w-full h-[5.51vh] border-[1.49px] border-[#8B8B8B] outline-none px-[0.774vw] rounded-xl appearance-none text-center"
            >
              {destinations.map((destination) => (
                <option key={destination.code} value={destination.code}>
                  {destination.city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-4 mt-4">
          <div className="w-[12.14vw] relative">
            <label
              htmlFor="fromDate"
              className="absolute top-[-1em] left-[0.774vw] bg-white px-1 text-sm font-normal"
            >
              From
            </label>
            <input
              type="text"
              id="fromDate"
              placeholder="YYYY-MM-DD"
              className="w-full h-[5.51vh] border-[1.49px] border-[#8B8B8B] outline-none px-[0.774vw] rounded-xl appearance-none text-center"
            />
          </div>
          <div className="w-[12.14vw] relative">
            <label
              htmlFor="toDate"
              className="absolute top-[-1em] left-[0.774vw] bg-white px-1 text-sm font-normal"
            >
              To
            </label>
            <input
              type="text"
              id="toDate"
              placeholder="YYYY-MM-DD"
              className="w-full h-[5.51vh] border-[1.49px] border-[#8B8B8B] outline-none px-[0.774vw] rounded-xl appearance-none text-center"
            />
          </div>
        </div>

        <div className="flex space-x-4 mt-4 mb-10">
          <div>
            <input
              type="radio"
              id="round-trip"
              name="tripType"
              value="round-trip"
              className="default"
              checked={tripType === "round-trip"}
              onChange={() => setTripType("round-trip")}
            />
            <label htmlFor="round-trip" className="ml-2">
              Round-trip
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="one-way"
              name="tripType"
              value="one-way"
              checked={tripType === "one-way"}
              onChange={() => setTripType("one-way")}
            />
            <label htmlFor="one-way" className="ml-2">
              One-way
            </label>
          </div>
        </div>

        <button className="w-[6.67vw] h-[2.5vw] bg-blue-600 text-white rounded-xl">
          Book Flight
        </button>
      </div>
    </Bounded>
  );
};
