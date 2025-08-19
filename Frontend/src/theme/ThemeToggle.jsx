import { useState } from "react";
import { IoSunny } from "react-icons/io5";
import { TbMoonFilled } from "react-icons/tb";
import { useTheme } from "./themeContext";
import { Button } from "@/components/ui/button";

const ThemeToggle = ({ className = "" }) => {
  const { lightTheme, darkTheme, theme } = useTheme();

  const handleToggle = () => {
    theme === "light" ? darkTheme() : lightTheme();
  };

  return (
    <Button
      onClick={handleToggle}
      variant="ghost"
      className={`opacity-80 hover:opacity-100 ${className}`}
    >
      {theme === "light" ? (
        <IoSunny size={16} className="smooth" />
      ) : (
        <TbMoonFilled size={16} className="smooth" />
      )}
    </Button>
  );
};

export default ThemeToggle;
