"use client";
import React, { useState, useEffect } from "react";
import { FlightDestination } from "@/types/FlightDestination";
import Bounded from "./Bounded";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BookFlight } from "@/lib/api/Booking";

export interface AirlineFormProps {
  destinations: FlightDestination[];
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const AirlineForm = ({ destinations = [] }: AirlineFormProps) => {
  const [tripType, setTripType] = useState("round-trip");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState<string>(
    destinations && destinations[0] ? destinations[0].code : ""
  );
  const [selectedDestination, setSelectedDestination] = useState<string>(
    destinations && destinations[1] ? destinations[1].code : ""
  );
  const [fromDateValue, setFromDateValue] = useState<string | null>(null);
  const [toDateValue, setToDateValue] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState<"fromDate" | "toDate">(
    "fromDate"
  );
  const [bookingResponse, setBookingResponse] = useState<{
    status?: string;
    timestamp?: string;
    bookingId?: string;
  }>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("origin")) setSelectedOrigin(params.get("origin") || "");
    if (params.get("destination"))
      setSelectedDestination(params.get("destination") || "");
    if (params.get("departureDate"))
      setFromDateValue(params.get("departureDate") || null);
    if (params.get("returnDate"))
      setToDateValue(params.get("returnDate") || null);
    if (params.get("type")) setTripType(params.get("type") || "round-trip");
  }, []);

  // Effect to update the URL based on state changes
  useEffect(() => {
    const newURL = new URL(window.location.href);
    newURL.searchParams.set("origin", selectedOrigin);
    newURL.searchParams.set("destination", selectedDestination);
    newURL.searchParams.set("departureDate", fromDateValue || "");
    if (tripType !== "one-way") {
      newURL.searchParams.set("returnDate", toDateValue || "");
    }
    newURL.searchParams.set("type", tripType);

    window.history.pushState({}, "", newURL.toString());
  }, [
    selectedOrigin,
    selectedDestination,
    fromDateValue,
    toDateValue,
    tripType,
  ]);

  const handleDateClick = (inputType: "fromDate" | "toDate") => {
    if (inputType === "toDate" && tripType === "one-way") {
      return;
    }
    setShowCalendar(true);
    setCurrentInput(inputType);
  };
  const handleDateChange = (value: Value, _: any) => {
    const selectedDate = Array.isArray(value) ? value[0] : value;

    if (currentInput === "fromDate") {
      setFromDateValue(selectedDate?.toISOString().split("T")[0] || "");
    } else {
      setToDateValue(selectedDate?.toISOString().split("T")[0] || "");
    }
    setShowCalendar(false);
  };

  // Fetch the available weekdays for the selected destination
  const selectedDestinationData = destinations.find(
    (destination) => destination.code === selectedDestination
  );
  const availableWeekdays = selectedDestinationData
    ? selectedDestinationData.availableWeekdays
    : [];

  // Define a function to disable dates based on availableWeekdays
  const disableDates = ({ date, view }: any) => {
    if (view === "month" && !availableWeekdays.includes(date.getDay())) {
      return true;
    }
    return false;
  };

  const handleFormSubmit = async () => {
    const formData: BookingFormData = {
      origin: selectedOrigin,
      destination: selectedDestination,
      departureDate: fromDateValue,
      returnDate: toDateValue,
      type: tripType,
    };

    try {
      const response = await BookFlight(formData);
      console.log("Form submitted successfully:", response);
      setBookingResponse(response);
      // Handle success
    } catch (error) {
      console.error("Failed to submit form:", error);
      // Handle failure
    }
  };

  return (
    <Bounded
      as="div"
      className="h-screen flex flex-col justify-center items-center"
    >
      <div className="bg-white h-full p-20 flex space-y-4 rounded-xl justify-center items-center">
        <div className="flex flex-col space-y-4 md:w-1/2">
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
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full h-[5.51vh] border-[1.49px] border-[#8B8B8B] outline-none px-[0.774vw] rounded-xl appearance-none text-center"
              >
                {destinations.map((destination) => (
                  <option
                    key={destination.code}
                    value={destination.code}
                    disabled={destination.code === selectedDestination}
                  >
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
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full h-[5.51vh] border-[1.49px] border-[#8B8B8B] outline-none px-[0.774vw] rounded-xl appearance-none text-center"
              >
                {destinations.map((destination) => (
                  <option
                    key={destination.code}
                    value={destination.code}
                    disabled={destination.code === selectedOrigin}
                  >
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
                value={fromDateValue || ""}
                placeholder="YYYY-MM-DD"
                required
                onClick={() => handleDateClick("fromDate")}
                readOnly
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
                value={toDateValue || ""}
                placeholder="YYYY-MM-DD"
                onClick={() => handleDateClick("toDate")}
                readOnly
                required
                className={`w-full h-[5.51vh] outline-none px-[0.774vw] rounded-xl appearance-none text-center ${
                  tripType === "one-way"
                    ? "border-[1.49px] border-[rgba(139, 139, 139, 0.5)] cursor-not-allowed"
                    : "border-[1.49px] border-[#8B8B8B]"
                }`}
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
                required
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

          <button
            className="w-[6.67vw] h-[2.5vw] bg-blue-600 text-white rounded-xl"
            onClick={handleFormSubmit}
          >
            Book Flight
          </button>

          {bookingResponse && bookingResponse.status && (
            <div className="mt-10 mb-4">
              <div>
                <strong>Status:</strong> {bookingResponse.status}
              </div>
              <div>
                <strong>Timestamp:</strong> {bookingResponse.timestamp}
              </div>
              <div>
                <strong>Booking ID:</strong> {bookingResponse.bookingId}
              </div>
            </div>
          )}
        </div>

        <div className="md:w-1/2 flex items-center justify-center">
          {showCalendar && (
            <Calendar
              className="rounded-md shadow-lg border-none"
              onChange={handleDateChange}
              value={new Date()}
              tileDisabled={disableDates}
            />
          )}
        </div>
      </div>
    </Bounded>
  );
};
