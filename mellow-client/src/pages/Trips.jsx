import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { AuthContext } from "../provider/AuthProvider";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";
import TripCard from "../components/unique/TripCard";
import "react-datepicker/dist/react-datepicker.css";

export default function Trips() {
    const { theme } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const location = useLocation();
    const navigate = useNavigate();

    // --- Get initial params from URL
    const params = new URLSearchParams(location.search);
    const [from, setFrom] = useState(params.get("from") || "");
    const [to, setTo] = useState(params.get("to") || "");
    const [date, setDate] = useState(params.get("date") ? new Date(params.get("date")) : null);
    const [busType, setBusType] = useState(params.get("busType") || "");

    const cities = ["Dhaka", "Dinajpur"];

    // --- Query all trips (public)
    // const { data: trips = [], isLoading, refetch } = useQuery({
    //     queryKey: ["trips", from, to, date, busType],
    //     queryFn: async () => {
    //         const res = await axiosPublic.get("/trips", {
    //             params: {
    //                 from,
    //                 to,
    //                 date: date ? format(date, "yyyy-MM-dd") : undefined,
    //                 busType,
    //             },
    //         });
    //         return res.data;
    //     },
    //     refetchOnWindowFocus: true,
    // });

    const trips = [
    {
        "id": 1,
        "busName": "Green Travels",
        "from": "Dhaka",
        "to": "Dinajpur",
        "departureTime": "08:00",
        "departureDate": "2025-09-02",
        "arrivalTime": "14:00",
        "arrivalDate": "2025-09-02",
        "duration": "6 hours",
        "busType": "AC",
        "price": 1500,
        "oldPrice": 1800,
        "seats": 10
    },
    {
        "id": 2,
        "busName": "Comfort Express",
        "from": "Dhaka",
        "to": "Dinajpur",
        "departureTime": "10:00",
        "departureDate": "2025-09-03",
        "arrivalTime": "16:00",
        "arrivalDate": "2025-09-03",
        "duration": "6 hours",
        "busType": "Non-AC",
        "price": 1200,
        "oldPrice": 1400,
        "seats": 8
    },
    {
        "id": 3,
        "busName": "Royal Riders",
        "from": "Dinajpur",
        "to": "Dhaka",
        "departureTime": "09:00",
        "departureDate": "2025-09-04",
        "arrivalTime": "15:00",
        "arrivalDate": "2025-09-04",
        "duration": "6 hours",
        "busType": "AC",
        "price": 1600,
        "oldPrice": 1900,
        "seats": 12
    },
    {
        "id": 4,
        "busName": "Fast Lane",
        "from": "Dhaka",
        "to": "Dinajpur",
        "departureTime": "07:00",
        "departureDate": "2025-09-05",
        "arrivalTime": "13:00",
        "arrivalDate": "2025-09-05",
        "duration": "6 hours",
        "busType": "Non-AC",
        "price": 1100,
        "oldPrice": 1300,
        "seats": 15
    },
    {
        "id": 5,
        "busName": "Sunset Tours",
        "from": "Dinajpur",
        "to": "Dhaka",
        "departureTime": "08:30",
        "departureDate": "2025-09-06",
        "arrivalTime": "14:30",
        "arrivalDate": "2025-09-06",
        "duration": "6 hours",
        "busType": "AC",
        "price": 1700,
        "oldPrice": 2000,
        "seats": 20
    },
    {
        "id": 6,
        "busName": "Dream Bus",
        "from": "Dhaka",
        "to": "Dinajpur",
        "departureTime": "06:30",
        "departureDate": "2025-09-07",
        "arrivalTime": "12:30",
        "arrivalDate": "2025-09-07",
        "duration": "6 hours",
        "busType": "Non-AC",
        "price": 1000,
        "oldPrice": 1200,
        "seats": 18
    },
    {
        "id": 7,
        "busName": "Luxury Line",
        "from": "Dinajpur",
        "to": "Dhaka",
        "departureTime": "09:30",
        "departureDate": "2025-09-08",
        "arrivalTime": "15:30",
        "arrivalDate": "2025-09-08",
        "duration": "6 hours",
        "busType": "AC",
        "price": 1800,
        "oldPrice": 2100,
        "seats": 25
    },
    {
        "id": 8,
        "busName": "Swift Shuttle",
        "from": "Dhaka",
        "to": "Dinajpur",
        "departureTime": "05:30",
        "departureDate": "2025-09-02",
        "arrivalTime": "11:30",
        "arrivalDate": "2025-09-02",
        "duration": "6 hours",
        "busType": "Non-AC",
        "price": 950,
        "oldPrice": 1100,
        "seats": 10
    },
    {
        "id": 9,
        "busName": "Skyline Express",
        "from": "Dinajpur",
        "to": "Dhaka",
        "departureTime": "10:00",
        "departureDate": "2025-09-03",
        "arrivalTime": "16:00",
        "arrivalDate": "2025-09-03",
        "duration": "6 hours",
        "busType": "AC",
        "price": 1550,
        "oldPrice": 1800,
        "seats": 8
    },
    {
        "id": 10,
        "busName": "City Bus",
        "from": "Dhaka",
        "to": "Dinajpur",
        "departureTime": "12:00",
        "departureDate": "2025-09-04",
        "arrivalTime": "18:00",
        "arrivalDate": "2025-09-04",
        "duration": "6 hours",
        "busType": "Non-AC",
        "price": 1050,
        "oldPrice": 1250,
        "seats": 12
    }
]



    // --- Filter client-side
    const filteredTrips = trips.filter((t) => {
        if (from && t.from !== from) return false;
        if (to && t.to !== to) return false;
        if (date) {
            const tripDate = new Date(t.departureDate); // Ensure this is a valid Date
            const selected = new Date(date); // Ensure the selected date is valid
            if (isNaN(tripDate.getTime()) || isNaN(selected.getTime())) {
                console.error("Invalid date format");
                return false; // Prevent further comparison if date is invalid
            }
            const tripDateFormatted = format(tripDate, "yyyy-MM-dd");
            const selectedFormatted = format(selected, "yyyy-MM-dd");
            if (tripDateFormatted !== selectedFormatted) return false;
        }
        if (busType && t.busType !== busType) return false;
        return true;
    });

    // --- Handle Filters change (trigger refetch when any filter is updated)
    // useEffect(() => {
        // refetch(); // Refetch trips data based on the updated filters
    // }, [from, to, date, busType, refetch]);

    // if (isLoading) {
    //     return (
    //         <div className="hero min-h-screen">
    //             <span className="loading loading-bars loading-lg"></span>
    //         </div>
    //     );
    // }

    const textColor = theme === "dark" ? "text-white" : "text-black";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const bgInput = theme === "dark" ? "bg-gray-800" : "bg-white";

    // --- Functions for location swapping and form resetting
    const otherCity = (city) => cities.find((c) => c !== city) || "";

    const handleFromChange = (val) => {
        setFrom(val);
        if (val && val === to) {
            setTo(otherCity(val));
            toast("Destination auto-switched to avoid conflict.");
        }
    };

    const handleToChange = (val) => {
        setTo(val);
        if (val && val === from) {
            setFrom(otherCity(val));
            toast("Departure auto-switched to avoid conflict.");
        }
    };

    const swapLocations = () => {
        if (!from && !to) {
            toast.error("Select locations first to swap.");
            return;
        }
        setFrom(to);
        setTo(from);
        toast.success("Locations swapped!");
    };

    const resetForm = () => {
        setFrom("");
        setTo("");
        setDate(null);
        setBusType("");
        toast.success("Form reset successfully.");
    };

    return (
        <div className="lg:py-20 md:py-12 py-8 px-4 lg:px-12">
            {/* Search Bar */}
            <div className={`w-full max-w-6xl mx-auto px-4 md:p-6 rounded-2xl flex flex-col items-end md:flex-row gap-4`}>
                {/* From */}
                <div className="flex flex-col flex-1 w-full">
                    <label className={`text-sm ${textColor}`}>From</label>
                    <select
                        value={from}
                        onChange={(e) => handleFromChange(e.target.value)}
                        className={`mt-1 p-3 border ${borderColor} rounded-lg w-full ${bgInput} ${textColor}`}
                    >
                        <option value="">Select</option>
                        {cities.map((city) => (
                            <option key={`from-${city}`} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Swap Button */}
                <div className="flex items-center justify-center">
                    <button
                        type="button"
                        onClick={swapLocations}
                        aria-label="Swap From and To"
                        className={`py-2 rounded-lg px-3 border ${borderColor} hover:bg-base-300 transition`}
                        title="Swap"
                    >
                        ⇄
                    </button>
                </div>

                {/* To */}
                <div className="flex flex-col flex-1 w-full">
                    <label className={`text-sm ${textColor}`}>To</label>
                    <select
                        value={to}
                        onChange={(e) => handleToChange(e.target.value)}
                        className={`mt-1 p-3 border ${borderColor} rounded-lg w-full ${bgInput} ${textColor}`}
                    >
                        <option value="">Select</option>
                        {cities.map((city) => (
                            <option key={`to-${city}`} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Picker */}
                <div className="flex flex-col flex-1 w-full">
                    <label className={`text-sm ${textColor}`}>Journey Date</label>
                    <DatePicker
                        selected={date}
                        onChange={(d) => setDate(d)}
                        minDate={new Date()}
                        maxDate={new Date(new Date().setDate(new Date().getDate() + 6))}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Pick a date"
                        className={`mt-1 w-full p-3 border ${borderColor} rounded-lg ${bgInput} ${textColor}`}
                        dayClassName={(d) => {
                            const today = new Date();
                            const max = new Date();
                            max.setDate(today.getDate() + 6);
                            if (d < today || d > max) return "text-gray-400 cursor-not-allowed";
                            return "";
                        }}
                    />
                </div>

                {/* Bus Type */}
                <div className="flex flex-col flex-1 w-full">
                    <label className={`text-sm ${textColor}`}>Bus Type</label>
                    <select
                        value={busType}
                        onChange={(e) => setBusType(e.target.value)}
                        className={`mt-1 p-3 border ${borderColor} rounded-lg w-full ${bgInput} ${textColor}`}
                    >
                        <option value="">Select</option>
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <button
                        onClick={resetForm}
                        className="relative inline-flex items-center justify-center px-5 py-[0.65rem] overflow-hidden font-medium bg-red-600 text-white hover:text-red-600 rounded-lg group border-red-700 border-[0.1rem] min-w-max"
                    >
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-base-100 rounded-full group-hover:w-56 group-hover:h-56"></span>
                        <span className="relative">Reset</span>
                    </button>
                </div>
            </div>

            {/* Trip Results */}
            <div className="mt-8 flex flex-col gap-6">
                {filteredTrips.length > 0 ? (
                    filteredTrips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} theme={theme} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        No trips found for your search.
                    </p>
                )}
            </div>
        </div>
    );
}
