// @ts-check
// React imports
import React, { useEffect } from "react"; // React Imports

// Component imports
import Sidebar from "@comp/Sidebar"; // Importing the Sidebar component

// Page imports
import Home from "@pages/pos/Home"; // Importing the Home page component from the POS directory

/**
 * The `function App()` is defining a functional component named `App`.
 * This component is responsible for rendering the main structure of the application.
 * It includes a `Sidebar` component and a `div` with the class name "dashboard" that contains the `Home` component.
 *
 * @function
 * @name App
 * @kind function
 * @returns {React.JSX.Element}
 */
function App() {
  useEffect(() => {
    console.log("Render App!");
  });
  return (
    <div className="container">
      <Sidebar />
      <div className="dashboard">
        <Home />
      </div>
    </div>
  );
}

export default App;
