import React from "react";
import { FaRegClock } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Upgrade = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-zinc-100/80 via-white to-zinc-50 dark:from-zinc-900/80 dark:via-black dark:to-zinc-800 rounded-xl shadow-lg p-8 transition-colors">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-zinc-200 dark:bg-zinc-800 rounded-full p-4 shadow-md mb-2">
          <FaRegClock className="text-zinc-600 dark:text-zinc-200 text-5xl animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-2 text-center">
          Upgrade Coming Soon!
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300 text-center max-w-md">
          We&apos;re working hard to bring you new features and an upgraded
          experience.
          <br />
          <span className="font-semibold text-zinc-800 dark:text-zinc-100">
            Stay tuned!
          </span>
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <span className="inline-block bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-full font-medium shadow">
            This feature will be available soon 🚀
          </span>
          <Link
            to="/user/home"
            className="mt-2 inline-block px-6 py-2 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold shadow hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
