import React from "react";

const Logo = ({ className = "", size = "", text = "" }) => {
  return (
    <div
      className={`${className} pacifico font-medium`}
      style={{
        fontSize: size,
      }}
    >
      {text} imagebox
    </div>
  );
};

export default Logo;
