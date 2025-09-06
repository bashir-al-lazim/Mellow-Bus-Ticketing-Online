import { useContext } from "react";
import Banner from "../components/unique/Banner";
import { AuthContext } from "../provider/AuthProvider";



const Home = () => {

    const { theme } = useContext(AuthContext)

    return (
        <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
            <Banner />
        </div>
    );
};

export default Home;