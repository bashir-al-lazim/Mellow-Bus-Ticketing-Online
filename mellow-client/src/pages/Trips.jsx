import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { AuthContext } from "../provider/AuthProvider";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";
import TripCard from "../components/shared/TripCard";
import "react-datepicker/dist/react-datepicker.css";

export default function Trips() {
    const { theme } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const location = useLocation();

    const cities = ["Dhaka", "Dinajpur"];

    const params = new URLSearchParams(location.search);
    const [from, setFrom] = useState(params.get("from") || "");
    const [to, setTo] = useState(params.get("to") || "");
    const [date, setDate] = useState(params.get("date") ? new Date(params.get("date")) : null);
    const [template_name, setTemplateName] = useState(params.get("template_name") || "");


    const { data: trips = [], isLoading, refetch } = useQuery({
        queryKey: ["trips", from, to, date, template_name],
        queryFn: async () => {
            console.log('Fetching trips with:', { from, to, date, template_name });
            const res = await axiosPublic.get("/trips", {
                params: {
                    from,
                    to,
                    date: date ? format(date, "yyyy-MM-dd") : undefined,
                    template_name,
                },
            });
            return res.data;
        },
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        refetch();
    }, [from, to, date, template_name, refetch]);

    if (isLoading) {
        return (
            <div className="hero min-h-screen">
                <span className="loading loading-bars loading-lg"></span>
            </div>
        );
    }

    const textColor = theme === "dark" ? "text-white" : "text-black";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const bgInput = theme === "dark" ? "bg-gray-800" : "bg-white";

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
        setTemplateName("");
        toast.success("Form reset successfully.");
    };

    const filteredTrips = Array.isArray(trips) ? trips.filter((t) => {
        if (from && t.origin_name !== from) return false;
        if (to && t.destination_name !== to) return false;
        if (date) {
            const tripDate = new Date(t.depart_at);
            const selected = new Date(date);
            if (isNaN(tripDate.getTime()) || isNaN(selected.getTime())) {
                console.error("Invalid date format");
                return false;
            }
            const tripDateFormatted = format(tripDate, "yyyy-MM-dd");
            const selectedFormatted = format(selected, "yyyy-MM-dd");
            if (tripDateFormatted !== selectedFormatted) return false;
        }
        if (template_name && t.template_name !== template_name) return false;
        return true;
    }) : [];

    return (
        <div className="lg:py-20 md:py-12 py-8 px-4 lg:px-12">
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
                        value={template_name}
                        onChange={(e) => setTemplateName(e.target.value)}
                        className={`mt-1 p-3 border ${borderColor} rounded-lg w-full ${bgInput} ${textColor}`}
                    >
                        <option value="">Select</option>
                        <option value="AC">AC</option>
                        <option value="NON-AC">NON-AC</option>
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

            <div className="mt-8 flex flex-col gap-6">
                {filteredTrips.length > 0 ? (
                    filteredTrips.map((trip) => (
                        <TripCard key={trip.trip_id} trip={trip} theme={theme} />
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
