// React imports
import React from "react";
import ReactDOM from "react-dom/client";

// Local component imports
import App from "./App.jsx";

// Styles imports
import "./styles/main.scss"; // Importing the main.scss stylesheet

// import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
