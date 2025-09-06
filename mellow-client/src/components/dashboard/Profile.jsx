import { useContext, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const Profile = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [topUpAmount, setTopUpAmount] = useState('');
    const [cashOutAmount, setCashOutAmount] = useState('');

    console.log('here I am ', user)

    const { refetch, data = {} } = useQuery({
        queryKey: ['users', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/accounts/${user.email}`);
            return res.data;
        }
    });

    const handleBalanceUpdate = async (newBalance) => {
        try {
            await axiosSecure.patch(`/accounts/update-balance/${user.email}`, {
                ewallet_balance: newBalance
            });
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Wallet updated",
                showConfirmButton: false,
                timer: 1500
            });
            refetch();
        } catch (err) {
            console.error(err);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed to update wallet",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const handleTopUp = () => {
        const amount = Number(topUpAmount);
        if (amount <= 0) return;
        handleBalanceUpdate(data.ewallet_balance + amount);
        setTopUpAmount('');
    };

    const handleCashOut = () => {
        const amount = Number(cashOutAmount);
        if (amount <= 0) return;
        handleBalanceUpdate(data.ewallet_balance - amount);
        setCashOutAmount('');
    };

    if (loading) {
        return <div className="hero min-h-screen"><span className="loading loading-bars loading-lg"></span></div>;
    }

    return (
        <div className="grid md:w-[90%] bg-base-200 mx-auto rounded-3xl py-10 px-8">
            <h1 className="text-4xl font-bold text-center">User Profile</h1>
            <div className="divider divider-neutral"></div>
            <div className="avatar justify-self-center my-4">
                <div className="mask mask-squircle w-24 bg-black">
                    <img src={user.photoURL} alt="user pic" className="text-white" />
                </div>
            </div>
            <div className="font-medium text-xl px-10 pt-5">
                <p>Name: {user.displayName}</p>
                <p>Email: {user.email}</p>
                <p>Wallet Balance: {data.ewallet_balance} tk</p>
            </div>

            <div className="px-10 pt-5 flex gap-6">
                {
                    <div className="flex space-y-2 flex-col">
                        <input
                            type="number"
                            placeholder="Top-Up Amount"
                            className="input input-bordered w-full"
                            value={topUpAmount}
                            onChange={e => setTopUpAmount(e.target.value)}
                            min="1" 
                        />
                        <button
                            onClick={handleTopUp}
                            disabled={Number(topUpAmount) <= 0}
                            className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-medium bg-yellow-400 text-white hover:text-yellow-400 rounded-lg group border-yellow-400 border-[0.1rem] min-w-max disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-base-100 rounded-full group-hover:w-56 group-hover:h-56"></span>
                            <span className="relative">Top-Up</span>
                        </button>
                    </div>
                }
                <div className="flex flex-col space-y-2">
                    <input
                        type="number"
                        placeholder="Cash-Out Amount"
                        className="input input-bordered"
                        value={cashOutAmount}
                        onChange={e => setCashOutAmount(e.target.value)}
                        min="1"
                    />
                    <button
                        onClick={handleCashOut}
                        disabled={Number(cashOutAmount) <= 0 || Number(cashOutAmount) > data.ewallet_balance}
                        className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-medium bg-yellow-400 text-white hover:text-yellow-400 rounded-lg group border-yellow-400 border-[0.1rem] min-w-max disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-base-100 rounded-full group-hover:w-56 group-hover:h-56"></span>
                        <span className="relative">Cash-Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
