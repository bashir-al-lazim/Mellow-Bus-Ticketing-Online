import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import auth from "../firebase/firebase.config";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";


export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light')
    const axiosPublic = useAxiosPublic()

    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const signInUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }
    const signOutUser = () => {
        setLoading(true)
        return signOut(auth)
    }

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photo
        });
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            const loggedUser = { email: currentUser?.email || user?.email }
            setUser(currentUser)
            
            if (currentUser) {
                axiosPublic.post('/users', {name: currentUser?.displayName, email: currentUser?.email})
                .then(res => {
                    console.log(res.data)
                    
                })
            }

            if (currentUser) {
                axiosPublic.post('/jwt', loggedUser)
                    .then(res => {
                        if (res.data.token) {
                            localStorage.setItem('accessToken', res.data.token)
                            return toast.success('Token created successfully!')
                        }
                        toast.error('Error! Could not create token')
                    })
                    .catch(() => toast.error('Error! Could not create token'))
            }
            else {

                localStorage.removeItem('accessToken')
                toast.success('Token removed successfully!')
            }
            setLoading(false)
        })

        return () => unSubscribe()

    }, [axiosPublic])


    useEffect(() => {
        localStorage.setItem('theme', theme)
        const getTheme = localStorage.getItem('theme')
        document.querySelector('html').setAttribute('data-theme', getTheme)
    }, [theme])

    const handleToogle = e => {
        if (e.target.checked) {
            setTheme('dark')
        }
        else {
            setTheme('light')
        }
    }

    const authInfo = { user, createUser, signInUser, signOutUser, loading, theme, handleToogle, updateUserProfile }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

AuthProvider.propTypes = {
    children: PropTypes.node
}