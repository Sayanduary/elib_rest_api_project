import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import Books from "./pages/Books";

const router = createBrowserRouter([
  {
    path: "/login",

    element: <Login />,
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "books",
        element: <Books />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Register />,
  },
]);

export default router;
