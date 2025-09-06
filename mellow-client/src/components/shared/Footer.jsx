import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../provider/AuthProvider';

const Footer = () => {

    const { theme } = useContext(AuthContext)


    return (
        <footer className={`${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
            <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} px-6 py-8 mx-auto`}>
                <div className={`flex flex-col sm:flex-row justify-between items-center sm:items-start text-center`}>
                    
                    <div className="flex items-center w-full sm:w-fit">
                        <h2 className="text-2xl text-white font-extrabold text-shadow-lg text-shadow-amber-500">mell<span className="text-yellow-400 text-3xl font-bold">OW</span></h2>
                    </div>

                    <div className="flex flex-col text-right sm:text-center -mx-4 w-full sm:w-fit">
                        <Link to='/' className="my-2 text-sm hover:text-yellow-400 hover:underline"> Home </Link>
                        <Link to='/trips' className="my-2 text-sm hover:text-yellow-400 hover:underline"> Trips </Link>
                    </div>

                    <p className='text-sm mt-4 text-left w-full sm:w-fit'><span className='text-yellow-400 underline font-semibold'>Contact:</span> contact@mellow.com <br /> <br /> <span className='text-yellow-400 underline font-semibold'>Address:</span> Holy Family, 1, Eskaton road, <br /> Dhaka-1000, Dhaka, Bangladesh</p>
                </div>

                <hr className="my-6 border-gray-200 md:my-10 dark:border-gray-700" />

                <div className="flex flex-col items-center sm:flex-row sm:justify-between">

                    <div className="flex -mx-2">

                        <Link to='https://web.facebook.com/' className="mx-2 hover:text-yellow-400" aria-label="Facebook">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2.00195 12.002C2.00312 16.9214 5.58036 21.1101 10.439 21.881V14.892H7.90195V12.002H10.442V9.80204C10.3284 8.75958 10.6845 7.72064 11.4136 6.96698C12.1427 6.21332 13.1693 5.82306 14.215 5.90204C14.9655 5.91417 15.7141 5.98101 16.455 6.10205V8.56104H15.191C14.7558 8.50405 14.3183 8.64777 14.0017 8.95171C13.6851 9.25566 13.5237 9.68693 13.563 10.124V12.002H16.334L15.891 14.893H13.563V21.881C18.8174 21.0506 22.502 16.2518 21.9475 10.9611C21.3929 5.67041 16.7932 1.73997 11.4808 2.01722C6.16831 2.29447 2.0028 6.68235 2.00195 12.002Z">
                                </path>
                            </svg>
                        </Link>

                    </div>
                    <p className="text-sm mt-5 sm:mt-0 text-center">© Copyright 2025 mellOW. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;