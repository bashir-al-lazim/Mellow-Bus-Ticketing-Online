import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';



const Signup = () => {

    const { createUser, signOutUser } = useContext(AuthContext)
    const [showPass, setShowPass] = useState(false)
    const [showPass2, setShowPass2] = useState(false)
    const navigate = useNavigate()

    const handleSignUp = e => {
        e.preventDefault()
        const name = e.target.name.value
        const email = e.target.email.value
        const password = e.target.password.value
        const password2 = e.target.password2.value
        const photoURL = e.target.photoURL.value

        if (password.length < 6) {
            toast.error('Password should be at least 6 characters')
            return
        }
        else if (!/^(?=.*[a-z])(?=.*[A-Z]).+$/.test(password)) {
            toast.error('Must contain one upper and lower case letter')
            return
        }
        else if (password !== password2) {
            toast.error('Password confirmation unsuccessfull! Please correct to proceed')
            return
        }

        createUser(email, password)
            .then((result) => {

                updateProfile(result.user, {
                    displayName: name,
                    photoURL: photoURL
                })
                    .then(() => console.log('profile updated'))
                    .catch(error => console.error(error))

                toast.success('Successfully registered')
                signOutUser()
                    .then(() => {
                        navigate('/login')
                    })
                    .catch(error => toast.error(error.message))
            })
            .catch(error => toast.error(error.message))
    }

    return (
        <div className="min-h-[calc(100vh-20.62rem)] text-wrap m-auto px-12 sm:px-0 mx-auto bg-base-200 pt-14">
            <div className="mx-auto h-full sm:w-max">
                <div className="py-12">
                    <div className="w-[80%] mx-auto rounded-2xl border p-8 sm:w-full">
                        <h3 className="text-2xl font-semibold text-gray-700 text-center"><span className="text-yellow-500">Join Us</span> to Experience an Exciting Journey <br /> with <span className="text-2xl font-bold">Mell<span className="text-yellow-500 text-3xl font-normal">ow</span></span></h3>

                        <form onSubmit={handleSignUp} className="mt-10 space-y-8">
                            <div>
                                <div className="relative before:absolute before:bottom-0 before:h-0.5 before:left-0 before:origin-right focus-within:before:origin-left before:right-0 before:scale-x-0 before:m-auto before:bg-yellow-400 focus-within:before:!scale-x-100 focus-within:invalid:before:bg-red-400 before:transition before:duration-500">
                                    <input type="text" placeholder="Your name" name='name' className="w-full bg-transparent pb-3  border-b border-gray-500 outline-none invalid:border-red-400 transition" required/>
                                </div>
                            </div>
                            <div>
                                <div className="relative before:absolute before:bottom-0 before:h-0.5 before:left-0 before:origin-right focus-within:before:origin-left before:right-0 before:scale-x-0 before:m-auto before:bg-yellow-400 focus-within:before:!scale-x-100 focus-within:invalid:before:bg-red-400 before:transition before:duration-500">
                                    <input type="url" placeholder="Your photo url" name='photoURL' className="w-full bg-transparent pb-3  border-b border-gray-500 outline-none invalid:border-red-400 transition" required/>
                                </div>
                            </div>
                            <div>
                                <div className="relative before:absolute before:bottom-0 before:h-0.5 before:left-0 before:origin-right focus-within:before:origin-left before:right-0 before:scale-x-0 before:m-auto before:bg-yellow-400 focus-within:before:!scale-x-100 focus-within:invalid:before:bg-red-400 before:transition before:duration-500">
                                    <input type="email" placeholder="Your email" name='email' className="w-full bg-transparent pb-3  border-b border-gray-500 outline-none invalid:border-red-400 transition" required/>
                                </div>
                            </div>

                            <div className="flex flex-col items-end w-full">
                                <div className="w-full flex relative before:absolute before:bottom-0 before:h-0.5 before:left-0 before:origin-right focus-within:before:origin-left before:right-0 before:scale-x-0 before:m-auto before:bg-yellow-400 focus-within:before:!scale-x-100 focus-within:invalid:before:bg-red-400 before:transition before:duration-500">
                                    <input type={showPass ? "text" : "password"} placeholder="Your password" name='password' className="w-full bg-transparent pb-3 border-b border-gray-500 outline-none invalid:border-red-400 transition" required/><span className="absolute right-4 top-1" onClick={() => {
                                        setShowPass(!showPass)
                                        setTimeout(() => setShowPass(false), 3000)
                                    }}>
                                        {
                                            showPass ? <FaEyeSlash className='fill-yellow-400 animate-pulse h-5 w-5' /> : <FaEye className='fill-yellow-400 h-5 w-5' />
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end w-full">
                                <div className="w-full flex relative before:absolute before:bottom-0 before:h-0.5 before:left-0 before:origin-right focus-within:before:origin-left before:right-0 before:scale-x-0 before:m-auto before:bg-yellow-400 focus-within:before:!scale-x-100 focus-within:invalid:before:bg-red-400 before:transition before:duration-500">
                                    <input type={showPass2 ? "text" : "password"} placeholder="Re-enter and confirm password" name='password2' className="w-full bg-transparent pb-3 border-b border-gray-500 outline-none invalid:border-red-400 transition" required/><span className="absolute right-4 top-1" onClick={() => {
                                        setShowPass2(!showPass2)
                                        setTimeout(() => setShowPass2(false), 3000)
                                    }}>
                                        {
                                            showPass2 ? <FaEyeSlash className='fill-yellow-400 animate-pulse h-5 w-5' /> : <FaEye className='fill-yellow-400 h-5 w-5' />
                                        }
                                    </span>
                                </div>
                            </div>


                            <div>
                                <button type="submit"
                                    className="w-full rounded-full bg-yellow-400 h-11 flex items-center justify-center px-6 py-3 hover:bg-yellow-600 active:bg-yellow-700 transition-colors duration-500"
                                >
                                    <span className="text-base font-semibold text-white">Sign Up</span>
                                </button>
                                <div className="-ml-3 w-full p-3 hover:text-yellow-400">
                                    <Link to='/login' className="text-sm tracking-wide font-medium hover:underline transition-all duration-300">Already have an account? Login Here!</Link>
                                </div>
                            </div>

                            <div className="text-center sm:-mb-8 md:w-[80%] w-full mx-auto">
                                <p className="text-xs mb-4">
                                    By proceeding, you agree to our <Link className="underline hover:text-yellow-400">Terms of Use</Link> and
                                    confirm you have read our <Link className="underline hover:text-yellow-400">Privacy and Cookie Statement</Link>.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Signup;