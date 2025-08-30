import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import Login from "../pages/Login";
import Signup from "../pages/Signup";



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
]);