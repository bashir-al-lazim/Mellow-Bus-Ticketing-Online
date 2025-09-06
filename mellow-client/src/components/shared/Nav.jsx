import { Link, NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import toast from "react-hot-toast";

const Nav = () => {
    const { user, signOutUser, theme, handleToogle } = useContext(AuthContext);
    const [scroll, setScroll] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScroll(window.scrollY > 112);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleSignOut = () => {
        signOutUser()
            .then(() => console.log("user successfully logged out"))
            .catch((error) => toast.error(error.message));
    };

    const pages = ({ isActive }) =>
        isActive
            ? `${theme === "dark" ? "text-white" : "text-black"} border-yellow-400  py-[0.575rem] border-transparent px-5 border-[0.1rem] transition duration-500 rounded-lg bg-base-100`
            : `${theme === "light" ? "text-black" : "text-white"} py-[0.575rem] px-5 border-[0.1rem] border-transparent hover:text-[#898888]`;

    const displayName = user?.displayName ?? "";
    const email = user?.email ?? "";
    const firstName = displayName ? displayName.split(" ")[0] : email.split?.("@")[0] ?? "";
    const initials =
        (displayName &&
            displayName
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0].toUpperCase())
                .slice(0, 2)
                .join("")) ||
        (email && email.split("@")[0].slice(0, 2).toUpperCase()) ||
        "ME";

    return (
        <div
            className={`${scroll ? "fixed top-0" : "absolute"} transition-all duration-500 ${theme === "light" ? "bg-[#8b8b8b58]" : "bg-[#00000058]"
                } z-50 shadow-lg w-full max-w-[89.9rem] rounded-b-2xl`}
        >
            <div className="sm:py-3 py-2 w-full pl-4 pr-7 navbar">
                <div className="flex items-center navbar-start">
                    <div className="dropdown mt-[0.225rem] mr-2">
                        <div tabIndex={0} role="button" className="lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 fill-yellow-400 stroke-yellow-400" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] -left-2 p-2 bg-transparent w-max gap-2 font-medium transition-all">
                            <NavLink to="/" className={({ isActive }) => (isActive ? "px-5 py-2 bg-base-100 border-[0.1rem] border-yellow-400 rounded-lg" : "px-5 py-2 bg-base-100 border-[0.1rem] border-b-[#898888] hover:text-[#898888] border-transparent")}>
                                Home
                            </NavLink>
                            <NavLink to="/trips" className={({ isActive }) => (isActive ? "px-5 py-2 bg-base-100 border-[0.1rem] border-yellow-400 rounded-lg" : "px-5 py-2 bg-base-100 border-[0.1rem] border-b-[#898888] hover:text-[#898888] border-transparent")}>
                                Trips
                            </NavLink>
                        </ul>
                    </div>
                    <div className="flex items-center">
                        <h2 className="text-2xl font-extrabold text-white text-shadow-lg text-shadow-amber-500">
                            mell<span className="text-yellow-400 text-3xl font-bold">OW</span>
                        </h2>
                    </div>
                </div>
                <div className="hidden lg:flex min-w-max navbar-center">
                    <ul className="font-medium gap-4">
                        <NavLink to="/" className={pages}>
                            Home
                        </NavLink>
                        <NavLink to="/trips" className={pages}>
                            Trips
                        </NavLink>
                    </ul>
                </div>
                <div id="nav-btn" className="flex gap-4 items-center navbar-end">
                    <label className="swap swap-rotate">
                        <input type="checkbox" onChange={handleToogle} checked={theme === "dark"} />
                        <svg className="swap-on fill-white w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                        </svg>
                        <svg className="swap-off fill-black w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                        </svg>
                    </label>

                    {user ? (
                        <div className="avatar dropdown dropdown-hover">
                            <div tabIndex={0} className="w-9 rounded-full border-[0.125rem] border-yellow-400 border-solid">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="avatar" className="p-[0.1rem] rounded-full" />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-white font-semibold">
                                        {initials}
                                    </div>
                                )}
                            </div>

                            <ul tabIndex={0} className="dropdown-content right-0 z-[1] menu p-2 shadow-md shadow-yellow-400 bg-base-100 rounded-lg min-w-max transition-all">
                                <p className="font-medium mb-2">Hi, <span className="uppercase">{firstName}</span></p>
                                <li>
                                    <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "bg-base-100 border-[0.1rem] font-medium border-yellow-400 rounded-lg" : "bg-base-100 border-[0.1rem] font-medium border-b-[#898888] hover:border-b-yellow-400 hover:text-yellow-400 border-transparent")}>
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li>
                                    <Link onClick={handleSignOut} className="border-[0.1rem] border-b-[#898888] hover:text-yellow-400 hover:border-b-yellow-400 font-medium border-transparent">
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <>
                            <Link to="/signup" className="relative hidden sm:inline-flex items-center justify-center px-5 py-2 overflow-hidden font-medium bg-yellow-400 text-white hover:text-yellow-400 rounded-lg group border-yellow-400 border-[0.1rem] min-w-max">
                                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-base-100 rounded-full group-hover:w-56 group-hover:h-56"></span>
                                <span className="relative">Sign Up</span>
                            </Link>
                            <Link to="/login" className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-medium bg-yellow-400 text-white hover:text-yellow-400 rounded-lg group border-yellow-400 border-[0.1rem] min-w-max">
                                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-base-100 rounded-full group-hover:w-56 group-hover:h-56"></span>
                                <span className="relative">Login</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Nav;
