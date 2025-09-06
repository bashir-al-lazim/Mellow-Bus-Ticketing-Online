import React from "react";
import { Link } from "react-router-dom";

export default function TripCard({ trip, theme, flag = false }) {
    const textColor = theme === "dark" ? "text-white" : "text-black";
    const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";

    console.log(trip)

    const {
        busName = "mellOW", // Default fallback value
        from,
        to,
        departureTime,
        departureDate,
        arrivalTime,
        arrivalDate,
        duration,
        busType,
        price,
        seats,
    } = trip;

    return (
        <div
            className={`w-full border ${borderColor} border-l-8 transition-all hover:border-l-yellow-400 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-6 ${cardBg} ${textColor}`}
        >
            {/* Left section: Bus info */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">
                <div>
                    <h2 className="font-bold text-lg">{busName}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Route: {from} - {to}
                    </p>
                    <p className="text-xs italic">{busType}</p>
                </div>
            </div>

            {/* Middle section: timings */}
            <div className="flex flex-col md:flex-row items-center gap-6 flex-1 justify-center">
                <div className="text-center">
                    <p className="font-semibold text-lg">{departureTime}</p>
                    <p className="text-sm">{departureDate}</p>
                    <p className="text-sm">{from}</p>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{duration}</span>
                    <div className="w-20 h-[2px] bg-yellow-400 my-1"></div>
                </div>

                <div className="text-center">
                    <p className="font-semibold text-lg">{arrivalTime}</p>
                    <p className="text-sm">{arrivalDate}</p>
                    <p className="text-sm">{to}</p>
                </div>
            </div>

            {/* Right section: price + seats + button */}
            <div className="flex flex-col items-center md:items-end gap-2">
                <div className="text-center md:text-right">
                    <p className="font-bold text-lg text-yellow-400">৳{price}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {seats} Seat(s) Available
                    </p>
                </div>
                {/* Using ternary operator for conditional rendering */}
                {flag ? (
                    ''
                ) : (
                    <Link
                        to={`/trips/${trip.id}`}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                        Book Ticket
                    </Link>
                )}
            </div>
        </div>
    );
}
