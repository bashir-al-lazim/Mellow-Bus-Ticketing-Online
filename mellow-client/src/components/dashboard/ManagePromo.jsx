import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link, useNavigate } from "react-router-dom";

const ManagePromo = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: promoCodes = [], refetch } = useQuery({
        queryKey: ["promoCodes"],
        queryFn: async () => {
            const res = await axiosSecure.get("/promo-codes");
            return res.data;
        },
    });

    const handleDelete = async (code) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Delete promo code "${code}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#d33",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/promo-codes?code=${code}`);
                    Swal.fire("Deleted!", "Promo code has been removed.", "success");
                    refetch();
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error!", "Failed to delete promo code.", "error");
                }
            }
        });
    };

    return (
        <div className="flex flex-col">
            <div>
                <h1 className="text-4xl font-bold text-center py-8">Manage Coupons</h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6">
                {promoCodes.map((promo) => (
                    <div
                        key={promo.code}
                        className="bg-base-200 shadow-md rounded-xl p-6 space-y-4"
                    >
                        <h2 className="text-2xl font-bold">{promo.code}</h2>
                        <p>{promo.description}</p>
                        <p>
                            <span className="font-semibold">Discount:</span>{" "}
                            {promo.type === "percentage"
                                ? `${promo.discount_value}%`
                                : `${promo.discount_value} tk`}
                        </p>
                        <p>
                            <span className="font-semibold">Start:</span>{" "}
                            {new Date(promo.start_at).toLocaleDateString()}
                        </p>
                        <p>
                            <span className="font-semibold">Expires:</span>{" "}
                            {promo.expires_at
                                ? new Date(promo.expires_at).toLocaleDateString()
                                : "No expiry"}
                        </p>
                        <p>
                            <span className="font-semibold">Combinable:</span>{" "}
                            {promo.combinable ? "Yes" : "No"}
                        </p>

                        <div className="flex gap-3 pt-2">
                            {/* Update Button */}
                            <Link
                                to={`/promo-codes/update/${promo.code}`}
                                className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-medium bg-yellow-400 text-white hover:text-yellow-400 rounded-lg group border-yellow-400 border-[0.1rem]"
                            >
                                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-base-100 rounded-full group-hover:w-56 group-hover:h-56"></span>
                                <span className="relative">Update</span>
                            </Link>

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDelete(promo.code)}
                                className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-medium bg-red-500 text-white hover:text-red-500 rounded-lg group border-red-500 border-[0.1rem]"
                            >
                                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-base-100 rounded-full group-hover:w-56 group-hover:h-56"></span>
                                <span className="relative">Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagePromo;
