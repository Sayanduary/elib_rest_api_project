import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import Books from "./pages/Books";
import CreateBook from "./pages/CreateBook";
import AuthLayout from "./layouts/AuthLayout";

const router = createBrowserRouter([
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
      {
        path: "books/create",
        element: <CreateBook />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);

export default router;
