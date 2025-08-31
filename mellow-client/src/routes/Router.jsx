import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Greet from "../components/dashboard/Greet";
import Dashboard from "../layout/Dashboard";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
        children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
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

    ]
  }
]);