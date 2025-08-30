import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Nav from "../components/shared/Nav";

const Root = () => {
    return (
        <div className="border-x border-white relative">
            <Nav />
            <Outlet />
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
        </div>
    );
};

export default Root;