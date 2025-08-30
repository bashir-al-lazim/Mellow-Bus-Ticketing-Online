import axios from "axios";

const axiosPublic = axios.create({
    baseURL: '',   //add server link
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;