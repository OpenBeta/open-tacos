import React from "react";

function Card({children, onPress}) {
  return (
    <div
      className={`card rounded-lg cursor-pointer hover:bg-yellow-50 border`}
      onClick={onPress}
      >
      <div className="m-5">
        {children}
      </div>
    </div>
  );
}

export default Card;