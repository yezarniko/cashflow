// React imports
import React from "react"; // Importing the React library
import ReactDOM from "react-dom/client"; // Importing the ReactDOM library (client-specific)

// Local component imports
import App from "./App.jsx"; // Importing the App component

// Styles imports
import "./styles/main.scss"; // Importing the main.scss stylesheet

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
