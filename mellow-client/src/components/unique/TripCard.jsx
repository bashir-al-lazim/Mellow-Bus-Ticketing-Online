import React from "react";
import { Link } from "react-router-dom";

export default function TripCard({ trip, theme, flag = false }) {
    const textColor = theme === "dark" ? "text-white" : "text-black";
    const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";

    const {
        trip_id,
        price_per_seat,
        depart_at,
        arrive_at,
        bus_license_number,
        status,
        routeStops,
        template_name,
        estimated_arrival_hours,
    } = trip;

    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    const departureDate = new Date(depart_at).toLocaleDateString();
    const departureTime = new Date(depart_at).toLocaleTimeString('en-US', options);
    const arrivalDate = new Date(arrive_at).toLocaleDateString();
    const arrivalTime = new Date(arrive_at).toLocaleTimeString('en-US', options);


    return (
        <div
            className={`w-full border ${borderColor} border-l-8 transition-all hover:border-l-yellow-400 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-6 ${cardBg} ${textColor}`}
        >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">
                <div>
                    <h2 className="font-bold text-lg">Bus {bus_license_number}</h2>
                    <p className="text-sm">
                        Route: {routeStops}
                    </p>
                    <p className="text-xs italic">{template_name || "No Template"}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 flex-1 justify-center">
                <div className="text-center">
                    <p className="font-semibold text-lg">{departureTime}</p>
                    <p className="text-sm">{departureDate}</p>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{estimated_arrival_hours} hours</span>
                    <div className="w-20 h-[2px] bg-yellow-400 my-1"></div>
                </div>

                <div className="text-center">
                    <p className="font-semibold text-lg">{arrivalTime}</p>
                    <p className="text-sm">{arrivalDate}</p>
                </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
                <div className="text-center md:text-right">
                    <p className="font-bold text-lg text-yellow-400">৳{price_per_seat}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Available Seats
                    </p>
                </div>
      
                {flag ? (
                    ''
                ) : (
                    <Link
                        to={`/trips/${trip_id}`}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                        Book Ticket
                    </Link>
                )}
            </div>
        </div>
    );
}
