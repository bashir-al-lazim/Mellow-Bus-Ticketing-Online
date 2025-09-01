import { useContext } from "react";
import Banner from "../components/unique/Banner";
import { AuthContext } from "../provider/AuthProvider";
import FindTrip from "../components/unique/FindTrip";



const Home = () => {

    const { theme } = useContext(AuthContext)

    return (
        <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
            <Banner />
            <FindTrip />
        </div>
    );
};

export default Home;