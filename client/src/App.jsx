// @ts-check
// React imports
import React, { useEffect } from "react"; // React Imports

import {
  Outlet,
  redirect,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Component imports
import Sidebar from "@comp/Sidebar";

// Page imports
import Home from "@pages/pos/Home";
import Sale from "@pages/pos/Sale";
import Products from "@pages/pos/Products";
import Logs from "@pages/pos/Logs";
import Statistics from "@pages/pos/Statistics";
import Settings from "@pages/pos/Settings";
import Login from "@pages/auth/Login";
import NotFound from "@comp/NotFound";
import Loading from "@comp/Loading";

async function loader() {
  const user = true;

  // await new Promise((resolve) => setTimeout(resolve, 10000));

  if (!user) {
    return redirect("/login");
  } else {
    return null;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <POS />,
    loader: loader,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sale",
        element: <Sale />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/logs",
        element: <Logs />,
      },
      {
        path: "/statistics",
        element: <Statistics />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={router} fallbackElement={<Loading />} />;
}

function POS() {
  return (
    <div className="App">
      <div className="container">
        <Sidebar />
        <div className="dashboard">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
