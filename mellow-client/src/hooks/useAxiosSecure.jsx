import axios from "axios";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import auth from "../firebase/firebase.config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000', 
})

const useAxiosSecure = () => {

    const navigate = useNavigate()

    axiosSecure.interceptors.request.use(function (config) {
        const token = localStorage.getItem('accessToken')
        // console.log('request stopped by interceptors', token)
        config.headers.authorization = `Bearer ${token}`;
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });

    useEffect(() => {
        axiosSecure.interceptors.response.use(res => {
            return res;
        }, (error) => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                toast.error('Unauthorized! Forcing logout...')
                signOut(auth)
                navigate('/login');
            }
        })
    }, [])

    return axiosSecure;
};

export default useAxiosSecure;