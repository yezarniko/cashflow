/* React */
import React from "react";

import fourZfour from "@assets/404.gif";

function NotFound() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <img
        src={fourZfour}
        style={{
          width: "100%",
          height: "100vh",
          objectFit: "cover",
          position: "absolute",
          userSelect: "none",
          zIndex: -1,
        }}
      />
      <h2
        style={{
          textAlign: "center",
          height: "100vh",
          lineHeight: "100vh",
          fontSize: "4em",
          color: "transparent",
          backgroundColor: "transparent",
          "-webkit-background-clip": "text",
          backgroundClip: "text",
          border: "1px solid black",
        }}
      >
        404 NOT FOUND
      </h2>
    </div>
  );
}

export default NotFound;
