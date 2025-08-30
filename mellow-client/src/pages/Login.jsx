import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from "../firebase/firebase.config";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Login = () => {

    const { signInUser } = useContext(AuthContext)
    const [showPass, setShowPass] = useState(false)
    const navigate = useNavigate()
    const providerGoogle = new GoogleAuthProvider();
    const location = useLocation()


    const handleLogin = e => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value

        signInUser(email, password)
            .then(() => {
                e.target.reset()
                toast.success('Successfully logged in')
                navigate(location.state ? location.state : '/')
            })
            .catch(() => toast.error('Invalid Email/Password'))
    }

    const handleGoogleLogin = () => {
        signInWithPopup(auth, providerGoogle)
            .then(() => {
                toast.success('Successfully logged in')
                navigate(location.state ? location.state : '/')
            })
            .catch(() => toast.error('ERROR! Try with another email!'))
    }

    return (
        <div className="min-h-[calc(100vh-20.62rem)] m-auto px-12 sm:px-0 mx-auto bg-base-200 pt-14">
            <div className="mx-auto h-full sm:w-max">
                <div className="m-auto py-12">
                    <div className="rounded-2xl border -mx-6 sm:-mx-10 p-8 sm:p-10">
                        <h3 className="text-2xl font-semibold text-gray-700 text-center"><span className="text-yellow-500">Login</span> to Experience the Best of <br /> <p className="text-2xl font-bold">Mell<span className="text-yellow-500 text-3xl font-normal">ow!</span></p></h3>
                        <div className="mt-12 flex flex-wrap sm:grid gap-6 grid-cols-2">
                            <button onClick={handleGoogleLogin}
                                className="w-full h-11 rounded-full border bg-base-100 px-6 transition duration-500 hover:scale-105 active:bg-yellow-400 hover:shadow-md hover:shadow-yellow-400"
                            >
                                <div className="w-max mx-auto flex items-center justify-center space-x-3">
                                    <img src="images/google.svg" className="w-6" alt="google logo" />
                                    <span className="block w-max text-sm font-semibold tracking-wide"
                                    >With Google</span>
                                </div>
                            </button>
                        </div>

                        <form onSubmit={handleLogin} className="mt-10 space-y-8 ">
                            <div>
                                <div className="relative before:absolute before:bottom-0 before:h-0.5 before:left-0 before:origin-right focus-within:before:origin-left before:right-0 before:scale-x-0 before:m-auto before:bg-yellow-400 focus-within:before:!scale-x-100 focus-within:invalid:before:bg-red-400 before:transition before:duration-500">
                                    <input type="email" placeholder="Your email" name="email" className="w-full bg-transparent pb-3  border-b border-gray-500 outline-none invalid:border-red-400 transition" required/>
                                </div>
                            </div>

                            <div className="flex flex-col items-end w-full">
                                <div className="w-full flex relative before:absolute before:bottom-0 before:h-0.5 before:left-0 before:origin-right focus-within:before:origin-left before:right-0 before:scale-x-0 before:m-auto before:bg-yellow-400 focus-within:before:!scale-x-100 focus-within:invalid:before:bg-red-400 before:transition before:duration-500">
                                    <input type={showPass ? "text" : "password"} placeholder="Your password" name="password" className="w-full bg-transparent pb-3 border-b border-gray-500 outline-none invalid:border-red-400 transition" required/><span className="absolute right-4 top-1" onClick={() => {
                                        setShowPass(!showPass)
                                        setTimeout(() => setShowPass(false), 4000)
                                    }}>
                                        {
                                            showPass ? <FaEyeSlash className='fill-yellow-400 animate-pulse h-5 w-5' /> : <FaEye className='fill-yellow-400 h-5 w-5' />
                                        }
                                    </span>
                                </div>

                                <div className="-mr-3 w-max p-3 right-0 hover:text-yellow-400">
                                    <Link to='' className="text-sm tracking-wide font-medium hover:underline transition-all duration-300">Forgot password ?</Link>
                                </div>
                            </div>

                            <div>
                                <button type="submit"
                                    className="w-full rounded-full bg-yellow-400 h-11 flex items-center justify-center px-6 py-3 hover:bg-yellow-600 active:bg-yellow-700 transition-colors duration-500"
                                >
                                    <span className="text-base font-semibold text-white">Login</span>
                                </button>
                                <div className="-ml-3 w-max p-3 hover:text-yellow-400">
                                    <Link to='/signup' className="text-sm tracking-wide font-medium hover:underline transition-all duration-300">Create new account !</Link>
                                </div>
                            </div>
                            <div className="border-t border-gray-500 pt-7">
                                <div className="space-x-4 text-center">
                                    <Link to='' className="text-sm hover:text-yellow-400  hover:underline transition-all duration-300">Contact</Link>
                                    <Link to='' className="text-sm hover:text-yellow-400  hover:underline transition-all duration-300">Privacy & Terms</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Login;