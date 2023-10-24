import React from "react";
import Animation_404 from "@assets/404_animation.gif";

function NotFound() {
  return (
    <div className="notFound__animation">
      <div className="notFound__animation__photo">
        <img src={Animation_404} />
      </div>
      <div className="notFound__animation__message">
        Site not found!
        <p>The site you're looking for is not here.</p>
      </div>
    </div>
  );
}

export default NotFound;
