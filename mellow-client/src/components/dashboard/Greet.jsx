import { useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const Greet = () => {

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
        <div className='uppercase text-center font-bold space-y-4 md:w-[90%] mx-auto'>
            <p className="text-2xl">Welcome to {data.role} dashboard</p>
            <p className="text-yellow-400 text-4xl">{data.name}</p>
        </div>
    );
};

export default Greet;