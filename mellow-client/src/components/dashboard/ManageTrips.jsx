import { useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import TripCard from "../shared/TripCard";

const ManageTrips = () => {
    const { theme } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data = [] } = useQuery({
        queryKey: ['trips'],
        queryFn: async () => {
            const res = await axiosSecure.get('/trips');
            return res.data;
        }
    });

    return (
        <div className="grid md:w-[90%] gap-6 mx-auto py-10">
            <h1 className="text-4xl font-bold text-center mb-6">Manage Trips</h1>

            {data.map((trip) => (
                <div key={trip.trip_id} className="flex flex-col md:flex-row gap-4 items-start">
                    <TripCard trip={trip} theme={theme} flag={true} />

                    <div className="flex flex-col justify-center gap-2">
                        <Link
                            to={`update-trip/${trip.trip_id}`}
                            className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-medium bg-yellow-400 text-white hover:text-yellow-400 rounded-lg group border-yellow-400 border-[0.1rem] min-w-max"
                        >
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-base-100 rounded-full group-hover:w-56 group-hover:h-56"></span>
                            <span className="relative">Update</span>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ManageTrips;
