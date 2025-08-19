import React from "react";

const Headers = ({ icon, tital = "", description = "" }) => {
  return (
    <div className="">
      <div className="flex items-center gap-3 ">
        {icon}
        <h1 className="text-xl font-medium">{tital}</h1>
      </div>
      <p className="text-xs font-medium md:w-[50%] w-full line-clamp-3 mt-1 text-zinc-500">
        {description}
      </p>
    </div>
  );
};

export default Headers;
