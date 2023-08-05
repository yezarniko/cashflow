import React from "react";

function Loading() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span class="loader"></span>
      <span
        style={{
          marginLeft: "1em",
          fontSize: "1.4em",
          color: "var(--secondary-color)",
        }}
      >
        Loading
      </span>
    </div>
  );
}

export default Loading;
