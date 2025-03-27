"use client";
import style from "./themeStyle.module.css";
import '../../styles/globals.css'
import React, { useContext } from "react";
import { MyContext } from "./ThemeContext";
import { Sun, Moon, Monitor } from "@phosphor-icons/react/dist/ssr";
const ThemeToggle = () => {
  const context = useContext(MyContext);

  if (!context) {
    return <div>Loading theme settings...</div>;
  }

  const {
    theme,
    setTheme,
    handleThemeChange,
    setDropDown,
    dropDown,
    handleDropDown,
    dropdownRef,
  } = useContext(MyContext);
  return (
    <div>
      <div className={style.dropDownContainer} ref={dropdownRef}>
        {
          <div
            className={`${style.dropDown} ${
              style.showDropDown ? style.showDropDown : style.hideDropDown
            }`}
          >
            <div className={style.inputContainer}>
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={handleThemeChange}
              />
              <div className={style.radioIcon}>
                <Sun />
              </div>
            </div>
            <div className={style.inputContainer}>
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={handleThemeChange}
              />
              <div className={style.radioIcon}>
                <Moon />
              </div>
            </div>
            <div className={style.inputContainer}>
              <input
                type="radio"
                name="theme"
                value="system"
                checked={theme === "system"}
                onChange={handleThemeChange}
              />
              <div className={style.radioIcon}>
                <Monitor />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default ThemeToggle;
