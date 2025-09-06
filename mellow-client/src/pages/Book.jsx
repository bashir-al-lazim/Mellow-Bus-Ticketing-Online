import React, { useState, useEffect } from 'react';
import TripCard from '../components/unique/TripCard';

const Book = () => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalFare, setTotalFare] = useState(0);
    const [seatData, setSeatData] = useState([]);


    const trip = {
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
    }

    const seatTemplate = {
        template_name: "Template A",
        seat_codes: "A1_A2_A3_A4_B1_B2_B3_B4_C1_C2_C3_C4_D1_D2_D3_D4_E1_E2_E3_E4_A1_A2_A3_A4_B1_B2_B3_B4_C1_C2_C3_C4_D1_D2_D3_D4_E1_E2_E3_E4", // Example seat code string
        total_seats: 40,
        seats_per_row: 4
    };


    const parseSeatCodes = () => {
        const rows = [];
        const seatCodes = seatTemplate.seat_codes.split('_');
        const rowsCount = Math.ceil(seatCodes.length / seatTemplate.seats_per_row);

        for (let i = 0; i < rowsCount; i++) {
            rows.push(seatCodes.slice(i * seatTemplate.seats_per_row, (i + 1) * seatTemplate.seats_per_row).map((seat) => ({
                id: seat,
                isAvailable: false 
            })));
        }

        setSeatData(rows);
    };

    // Calculate total fare based on selected seats, assuming price per seat is available
    const calculateTotalFare = () => {
        const seatPrice = 100; // Example: Replace with dynamic value from seatData
        const fare = selectedSeats.length * seatPrice;
        return fare;
    };

    useEffect(() => {
        parseSeatCodes(); // Parse seat codes when the component mounts
    }, []);

    useEffect(() => {
        setTotalFare(calculateTotalFare());
    }, [selectedSeats]);

    // Handle seat selection
    const handleSeatSelect = (seatId) => {
        setSelectedSeats((prevSelected) => {
            if (prevSelected.includes(seatId)) {
                return prevSelected.filter((id) => id !== seatId);
            } else {
                return [...prevSelected, seatId];
            }
        });
    };

    return (
        <div className="lg:py-28 md:py-12 py-8 px-4 lg:px-12">
            <div className="w-full pb-6 md:pb-12">
                <TripCard trip={trip} flag={true} />
            </div>

            <div className="flex justify-center">
                <div className="w-2/4">
                    <div className={`gap-2`}>
                        {seatData.map((row, rowIndex) => (
                            <div key={rowIndex} className={`grid grid-cols-${seatTemplate.seats_per_row} space-x-4 space-y-7`}>
                                {row.map((seat) => (
                                    <div
                                        key={seat.id}
                                        className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-md ${selectedSeats.includes(seat.id)
                                            ? 'bg-green-500 text-white'
                                            : seat.isAvailable
                                                ? 'bg-gray-200 hover:bg-gray-300'
                                                : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                        onClick={() => seat.isAvailable && handleSeatSelect(seat.id)}
                                    >
                                        {seat.id}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-1/4 bg-white p-5 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Fare Details</h3>
                    <div className="my-3">
                        <div className="flex justify-between">
                            <span>Total Seats Selected:</span>
                            <span>{selectedSeats.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Seat Fare:</span>
                            <span>{totalFare} BDT</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>{(totalFare * 0.1).toFixed(2)} BDT</span> {/* Example: 10% tax */}
                        </div>
                        <div className="flex justify-between">
                            <span>Platform Fee:</span>
                            <span>{(totalFare * 0.05).toFixed(2)} BDT</span> {/* Example: 5% platform fee */}
                        </div>
                        <div className="flex justify-between">
                            <span>Discount:</span>
                            <span>0 BDT</span> {/* Apply discount logic here if any */}
                        </div>
                        <div className="flex justify-between font-semibold">
                            <span>Final Fare:</span>
                            <span>{(totalFare + (totalFare * 0.1) + (totalFare * 0.05)).toFixed(2)} BDT</span>
                        </div>
                    </div>
                    <button className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                        Confirm Seat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Book;
