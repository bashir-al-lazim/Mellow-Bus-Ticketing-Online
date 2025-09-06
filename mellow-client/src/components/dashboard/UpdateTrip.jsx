import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const UpdateTrip = () => {
    const { trip_id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: trip = {}, refetch } = useQuery({
        queryKey: ["trips", trip_id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/trips/${trip_id}`);
            return res.data;
        }
    });

    const [formData, setFormData] = useState({
        price_per_seat: 0,
        delay_hours: 0
    });

    useEffect(() => {
        if (trip?.price_per_seat) {
            setFormData({ price_per_seat: trip.price_per_seat, delay_hours: 0 });
        }
    }, [trip]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "delay_hours" && Number(value) < 0) return;
        setFormData({ ...formData, [name]: value });
    };

    const formatForMariaDB = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        const ss = String(date.getSeconds()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to update this trip?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#3085d6"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const delayMs = Number(formData.delay_hours) * 60 * 60 * 1000;
                    const newDepartAt = new Date(new Date(trip.depart_at).getTime() + delayMs);
                    const newArriveAt = new Date(new Date(trip.arrive_at).getTime() + delayMs);

                    const payload = {
                        price_per_seat: Number(formData.price_per_seat),
                        depart_at: formatForMariaDB(newDepartAt),
                        arrive_at: formatForMariaDB(newArriveAt)
                    };

                    await axiosSecure.patch(`/trips?trip_id=${trip_id}`, payload);

                    Swal.fire("Updated!", "Trip updated successfully.", "success");
                    refetch();
                    navigate("/dashboard/manage-trips");
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error!", "Failed to update trip.", "error");
                }
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-base-100 rounded shadow">
            <h2 className="text-4xl font-bold mb-6">Update Trip</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-2">Price Per Seat</label>
                    <input
                        type="number"
                        name="price_per_seat"
                        className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-yellow-200"
                        value={formData.price_per_seat}
                        onChange={handleChange}
                        min={0}
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">Add Delay (Hours)</label>
                    <input
                        type="number"
                        name="delay_hours"
                        className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-yellow-200"
                        value={formData.delay_hours}
                        onChange={handleChange}
                        min={0}
                        required
                    />
                </div>

                <input
                    type="submit"
                    value="Update Trip"
                    className="w-full bg-yellow-400 text-white py-3 rounded hover:bg-yellow-500 transition cursor-pointer"
                />
            </form>
        </div>
    );
};

export default UpdateTrip;
