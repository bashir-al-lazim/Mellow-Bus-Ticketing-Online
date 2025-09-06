import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Greet from "../components/dashboard/Greet";
import Dashboard from "../layout/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";
import Trips from "../pages/Trips";
import Book from "../pages/Book";
import Profile from "../components/dashboard/Profile";
import ManagePromo from "../components/dashboard/ManagePromo";
import UpdatePromo from "../components/dashboard/UpdatePromo";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/trips',
        element: <Trips />,
      },
      {
        path: '/trips/:trip_id',
        element: <Book />,
      },
    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    children: [
      {
        index: true,
        element: <Greet />
      },
      {
        path: 'my-profile',
        element: <Profile />
      },
      {
        path: 'manage-promo',
        element: <ManagePromo />
      },
      {
        path: 'manage-promo/update-promo/:code',
        element: <UpdatePromo />
      },

    ]
  }
]);