import React from "react";
import { Switch } from "antd";
import { FaMoon, FaSun } from "react-icons/fa";

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  toggleDarkMode: (checked: boolean) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  isDarkMode,
  toggleDarkMode,
}) => {
  return (
    <Switch
      checkedChildren={<FaSun style={{ color: "#FFD700" }} />}
      unCheckedChildren={<FaMoon style={{ color: "#4B4B4B" }} />}
      checked={isDarkMode}
      onChange={toggleDarkMode}
    />
  );
};

export default ThemeSwitcher;
