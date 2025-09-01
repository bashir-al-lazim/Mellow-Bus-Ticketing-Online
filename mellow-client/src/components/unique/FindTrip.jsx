import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { AuthContext } from "../../provider/AuthProvider";
import toast, { Toaster } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";

export default function FindTrip() {
    const navigate = useNavigate();
    const { theme } = useContext(AuthContext);

    const cities = ["Dhaka", "Dinajpur"];
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState(null);
    const [busType, setBusType] = useState("");

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

    const handleSearch = () => {
        if (!from || !to || !date || !busType) {
            toast.error("Please fill up all the boxes to search");
            return;
        }
        if (from === to) {
            toast.error("Departure and destination cannot be the same.");
            return;
        }

        const formattedDate = format(date, "yyyy-MM-dd");
        const params = new URLSearchParams({
            from,
            to,
            date: formattedDate,
            busType,
        });

        navigate(`/trips?${params.toString()}`);
        toast.success("Searching trips...");
    };

    const textColor = theme === "dark" ? "text-white" : "text-black";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const bgInput = theme === "dark" ? "bg-gray-800" : "bg-white";

    // Inject dynamic styles for DatePicker
    useEffect(() => {
        const style = document.createElement("style");
        style.id = "datepicker-theme";
        style.innerHTML = `
    .react-datepicker {
      background-color: ${theme === "dark" ? "#1f2937" : "white"};
      color: ${theme === "dark" ? "white" : "black"};
      border: 1px solid ${theme === "dark" ? "#374151" : "#d1d5db"};
    }

    /* Header (month + year) */
    .react-datepicker__header {
      background-color: ${theme === "dark" ? "#374151" : "#f3f4f6"}; /* dark gray in dark mode */
      border-bottom: 1px solid ${theme === "dark" ? "#4b5563" : "#d1d5db"};
    }

    /* Month and year text */
    .react-datepicker__current-month,
    .react-datepicker__day-names {
      color: ${theme === "dark" ? "white" : "black"};
    }

    .react-datepicker__day-name {
      color: ${theme === "dark" ? "white" : "black"};
    }

    /* Available days */
    .react-datepicker__day {
      color: ${theme === "dark" ? "white" : "black"};
    }

    /* Selected day (yellow) */
    .react-datepicker__day--selected {
      background-color: #facc15 !important; /* yellow */
      color: black !important;
    }

    /* Disabled days */
    .react-datepicker__day--disabled {
      color: ${theme === "dark" ? "#9ca3af" : "#d1d5db"};
      cursor: not-allowed;
    }

    /* Hover effect */
    .react-datepicker__day:hover:not(.react-datepicker__day--disabled) {
      background-color: ${theme === "dark" ? "#374151" : "#e5e7eb"};
    }

    /* Navigation buttons */
    .react-datepicker__navigation {
      border-color: ${theme === "dark" ? "white" : "black"};
    }
  `;
        const oldStyle = document.getElementById("datepicker-theme");
        if (oldStyle) oldStyle.remove();
        document.head.appendChild(style);
    }, [theme]);


    return (
        <div className="lg:py-32 md:py-16 sm:py-8">
            <div className="text-center lg:pb-20 md:pb-14 sm:pb-4">
                <h1 className="text-7xl font-bold">Find your <span className="text-yellow-400">Trip</span></h1>
            </div>
            <div
                className={`w-full max-w-6xl mx-auto px-4 md:p-6 rounded-2xl flex flex-col items-end md:flex-row items-center gap-4`}
                style={{ backgroundColor: "transparent" }}
            >
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
                            <option key={`from-${city}`} value={city} disabled={to === city}>
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
                            <option key={`to-${city}`} value={city} disabled={from === city}>
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
                    <button onClick={handleSearch}
                        className="relative inline-flex items-center justify-center px-5 py-[0.65rem] overflow-hidden font-medium bg-yellow-400 text-white hover:text-yellow-400 rounded-lg group border-yellow-400 border-[0.1rem] min-w-max">
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-base-100 rounded-full group-hover:w-56 group-hover:h-56"></span>
                        <span className="relative">Search</span>
                    </button>
                    <button onClick={resetForm}
                        className="relative inline-flex items-center justify-center px-5 py-[0.65rem] overflow-hidden font-medium bg-red-600 text-white hover:text-red-600 rounded-lg group border-red-700 border-[0.1rem] min-w-max">
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-base-100 rounded-full group-hover:w-56 group-hover:h-56"></span>
                        <span className="relative">Reset</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
