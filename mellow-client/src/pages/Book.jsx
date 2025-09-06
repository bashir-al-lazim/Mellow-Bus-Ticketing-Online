import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../provider/AuthProvider";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";
import TripCard from "../components/unique/TripCard";

export default function Book() {
    const { trip_id } = useParams();
    const { theme, user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const queryClient = useQueryClient();

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalFare, setTotalFare] = useState(0);
    const [seatData, setSeatData] = useState([]);

    const { data, isLoading } = useQuery({
        queryKey: ["tripDetails", trip_id],
        queryFn: async () => {
            const response = await axiosPublic.get(`/trips/${trip_id}`);
            return response.data;
        },
    });

    const tripDetails = data && !data.message ? data : null;

    useEffect(() => {
        if (tripDetails?.seatTemplateDetails && tripDetails?.tripSeats) {
            const seatTemplate = tripDetails.seatTemplateDetails;
            const tripSeats = tripDetails.tripSeats;
            const seatCodes = seatTemplate.seat_codes.split("_");
            const rowsCount = Math.ceil(seatCodes.length / seatTemplate.seats_per_row);
            const rows = [];

            for (let i = 0; i < rowsCount; i++) {
                const row = seatCodes
                    .slice(i * seatTemplate.seats_per_row, (i + 1) * seatTemplate.seats_per_row)
                    .map((seatCode) => {
                        const seatStatus = tripSeats.find(
                            (seat) => seat.trip_seat_id === `${tripDetails.trip_id}_${seatCode}`
                        );
                        return {
                            id: seatCode,
                            isAvailable: seatStatus ? seatStatus.status === "available" : false,
                        };
                    });
                rows.push(row);
            }
            setSeatData(rows);
        }
    }, [tripDetails]);

    useEffect(() => {
        if (tripDetails) setTotalFare(selectedSeats.length * tripDetails.price_per_seat);
    }, [selectedSeats, tripDetails]);

    const handleSeatSelect = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(prev => prev.filter(id => id !== seatId));
        } else {
            if (selectedSeats.length >= 4) {
                toast.error("You can select a maximum of 4 seats per trip.");
                return;
            }
            setSelectedSeats(prev => [...prev, seatId]);
        }
    };

    const finalFare = totalFare + totalFare * 0.01 + totalFare * 0.005;

    const handlePayNow = async () => {
        const finalFare = totalFare + totalFare * 0.01 + totalFare * 0.005;

        if (user.ewallet_balance < finalFare) {
            toast.error("Insufficient balance");
            return;
        }

        try {
            await axiosPublic.post(`/trips/${trip_id}/book-seats`, {
                seats: selectedSeats
            });

            await axiosPublic.post(`/users/${user.email}/deduct`, {
                amount: finalFare
            });

            toast.success("Booking successful");
            setSelectedSeats([]);
            queryClient.invalidateQueries(["tripDetails", trip_id]);
        } catch (err) {
            console.error(err);
            toast.error("Failed to process payment or booking");
        }
    };


    if (isLoading) return <div className="hero min-h-screen"><span className="loading loading-bars loading-lg"></span></div>;
    if (!tripDetails) return <div className="hero min-h-screen"><span className="text-red-500">Trip not found or failed to load.</span></div>;

    return (
        <div className="lg:py-28 md:py-12 py-8 px-4 lg:px-12">
            <div className="w-full pb-6 md:pb-12">
                <TripCard trip={tripDetails} flag={true} theme={theme} />
            </div>

            <div className="flex justify-center gap-6">
                <div className="w-2/4">
                    {seatData.length > 0 ? seatData.map((row, rowIndex) => (
                        <div key={rowIndex} className={`grid grid-cols-${tripDetails.seatTemplateDetails.seats_per_row} gap-4 mb-4`}>
                            {row.map(seat => (
                                <div
                                    key={seat.id}
                                    className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-md
                                        ${selectedSeats.includes(seat.id) ? "bg-green-500 text-white" : seat.isAvailable ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-400 cursor-not-allowed"}`}
                                    onClick={() => seat.isAvailable && handleSeatSelect(seat.id)}
                                >
                                    {seat.id}
                                </div>
                            ))}
                        </div>
                    )) : <p className="text-gray-500">No seat data available</p>}
                </div>

                <div className="w-1/4 bg-white p-5 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Fare Details</h3>
                    <div className="my-3">
                        <div className="flex justify-between"><span>Total Seats Selected:</span><span>{selectedSeats.length}</span></div>
                        <div className="flex justify-between"><span>Seat Fare:</span><span>{totalFare} BDT</span></div>
                        <div className="flex justify-between"><span>Tax:</span><span>{(totalFare * 0.01).toFixed(2)} BDT</span></div>
                        <div className="flex justify-between"><span>Platform Fee:</span><span>{(totalFare * 0.005).toFixed(2)} BDT</span></div>
                        <div className="flex justify-between"><span>Discount:</span><span>0 BDT</span></div>
                        <div className="flex justify-between font-semibold"><span>Final Fare:</span><span>{finalFare.toFixed(2)} BDT</span></div>
                    </div>
                    <button onClick={handlePayNow} className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Pay Now</button>
                </div>
            </div>
        </div>
    );
}
