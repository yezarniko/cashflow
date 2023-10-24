// @ts-check
// React imports
import React, { useEffect, useState, Suspense } from "react"; // React Imports

// import {
//   Outlet,
//   redirect,
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

// Component imports
import Sidebar from "@comp/Sidebar";

// Page imports
import Home from "@pages/pos/Home";
import Sale from "@pages/pos/Sale";
import Products from "@pages/pos/Products";
import NewProductForm from "@pages/pos/NewProductForm";
import Logs from "@pages/pos/Logs";
import Statistics from "@pages/pos/Statistics";
import Settings from "@pages/pos/Settings";
import Login from "@pages/auth/Login";
import SignUp from "@pages/auth/SignUp";
import NotFound from "@comp/NotFound";
import Loading from "@comp/Loading";
import { UserProvider, useUser } from "@hooks/useUser";
import { FirebaseStorageProvider } from "@hooks/useFirebaseStorage";
import AccountVerification from "@pages/auth/AccountVerification";
import ForgotPassword from "@pages/auth/ForgotPassword";
import { CashListContextProvider } from "@hooks/useCashList";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  gql,
  useMutation,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});

// const AuthRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <POS />,
//     errorElement: <NotFound />,
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "/sale",
//         element: <Sale />,
//       },
//       {
//         path: "/products",
//         element: <Products />,
//       },
//       {
//         path: "/logs",
//         element: <Logs />,
//       },
//       {
//         path: "/statistics",
//         element: <Statistics />,
//       },
//       {
//         path: "/settings",
//         element: <Settings />,
//       },
//     ],
//   },
// ]);

// const NoAuthRouter = createBrowserRouter([
//   {
//     path: "/",
//     children: [
//       {
//         path: "/",
//         loader: () => redirect("/login"),
//       },
//       {
//         path: "/*",
//         loader: () => redirect("/login"),
//       },
//       {
//         path: "/login",
//         element: <Login />,
//       },
//       {
//         path: "/signup",
//         element: <SignUp />,
//       },
//     ],
//   },
// ]);

const ADD_USER_TO_DB = gql`
  mutation AddUserToDB($userId: String!, $accountToken: String!) {
    addUser(userId: $userId, accountToken: $accountToken) {
      userId
      branches {
        branchId
        name
      }
    }
  }
`;

function App() {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <FirebaseStorageProvider>
          <CashListContextProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </CashListContextProvider>
        </FirebaseStorageProvider>
      </UserProvider>
    </ApolloProvider>
  );
}

function AppRoutes() {
  const { currentUser } = useUser();
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const [addUserToDB, { data, loading, error }] = useMutation(ADD_USER_TO_DB);

  useEffect(() => {
    if (currentUser) {
      setIsAuthenticate(currentUser.emailVerified);

      console.log(currentUser);
      if (!loading) {
        addUserToDB({
          variables: {
            userId: currentUser.uid,
            accountToken: currentUser.accessToken,
          },
        });
      }
    } else {
      setIsAuthenticate(false);
    }
  }, [currentUser]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticate ? (
            <div className="App">
              <div className="container">
                <Sidebar />
                <div className="dashboard">
                  <Outlet />
                </div>
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/products" element={<Products />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/addnewproducts" element={<NewProductForm />} />
      </Route>
      <Route
        path="/login"
        element={!isAuthenticate ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!isAuthenticate ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/verification"
        element={
          !isAuthenticate ? <AccountVerification /> : <Navigate to="/" />
        }
      />
      <Route
        path="/forgetpassword"
        element={!isAuthenticate ? <ForgotPassword /> : <Navigate to="/" />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
