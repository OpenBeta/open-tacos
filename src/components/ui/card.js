import React from "react";

function Card({children}) {
  return (
    <div
      className="card rounded-lg cursor-pointer hover:bg-yellow-50 border"
      >
      <div className="m-5">
        {children}
      </div>
    </div>
  );
}

export default Card;