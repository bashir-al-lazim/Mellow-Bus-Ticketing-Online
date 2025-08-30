import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Nav from "../components/shared/Nav";
import Footer from "../components/shared/Footer";

const Root = () => {
    return (
        <div className="border-x border-white relative">
            <Nav />
            <Outlet />
            <Footer />
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
        </div>
    );
};

export default Root;