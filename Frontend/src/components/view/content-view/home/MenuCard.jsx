import React from "react";

const MenuCard = ({ name, icon, bg, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg flex flex-col gap-4 text-sm font-medium cursor-pointer border border-zinc-500/30 ${
        bg && `${bg} text-zinc-200 dark:text-zinc-800`
      } overflow-hidden`}
    >
      <i className="text-lg">{icon}</i>
      {name}
    </div>
  );
};

export default MenuCard;
