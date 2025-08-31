import { useContext } from "react";
import { FaCartPlus, FaDatabase, FaHome, FaList, FaShoppingCart, FaUser, FaUsers } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../provider/AuthProvider";
import { BiSolidCoupon } from "react-icons/bi";


const Dashboard = () => {

    const { user } = useContext(AuthContext)
    const axiosSecure = useAxiosSecure()

    const { data = {} } = useQuery({
        queryKey: ['users', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`)
            return res.data
        }
    })

    return (
        <div className="flex flex-col md:flex-row">
            {/* dashboard side bar */}
            <div className="md:w-64 md:min-h-screen bg-base-300 border-r-[0.125rem] border-r-yellow-600">
                <ul className="menu p-4 ">
                    {
                        data.role === 'admin' && <>
                            <li>
                                <NavLink to="/dashboard/admin-profile">
                                    <FaDatabase />
                                    Profile</NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/manage-trips">
                                    <FaUsers></FaUsers>
                                    Manage Trips</NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/manage-coupons">
                                    <BiSolidCoupon />
                                    Manage Coupons</NavLink>
                            </li>
                        </>
                    }
                    {
                        data.role === 'user' && <>
                            <li>
                                <NavLink to="/dashboard/user-profile">
                                    <FaUser />
                                    Profile</NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/my-coupons">
                                    <FaCartPlus />
                                    Coupons</NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/my-bookings">
                                    <FaList></FaList>
                                    Bookings</NavLink>
                            </li>
                        </>
                    }
                    {/* shared nav links */}
                    <div className="divider divider-warning"></div>
                    <li>
                        <NavLink to="/">
                            <FaHome></FaHome>
                            Home</NavLink>
                    </li>
                </ul>
            </div>
            {/* dashboard content */}
            <div className="flex flex-1 py-5 md:py-10 px-4 items-start">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Dashboard;