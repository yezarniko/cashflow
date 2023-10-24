import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useUser } from "@hooks/useUser";

export default function PrivateRoute({ path, element: Element }) {
  const { currentUser } = useUser();

  return (
    <Route
      path={path}
      element={
        currentUser ? (
          <div className="App">
            <div className="container">
              <Sidebar />
              <div className="dashboard">
                <Element />
              </div>
            </div>
          </div>
        ) : (
          <Navigate to="/login" replace />
        )
      }
    >
      {children}
    </Route>
  );
}
