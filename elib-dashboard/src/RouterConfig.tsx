import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
]);

export default router;
