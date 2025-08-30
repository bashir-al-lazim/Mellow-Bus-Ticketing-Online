import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const Root = () => {
    return (
        <div className="border-x border-white relative">
            <Outlet />
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
        </div>
    );
};

export default Root;