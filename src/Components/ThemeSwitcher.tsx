import React from "react";
import { Switch } from "antd";

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
      checkedChildren="Claro"
      unCheckedChildren="Oscuro"
      checked={isDarkMode}
      onChange={toggleDarkMode}
    />
  );
};

export default ThemeSwitcher;
