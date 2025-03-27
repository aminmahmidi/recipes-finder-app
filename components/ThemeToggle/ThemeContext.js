"use client";
import React, { createContext, useState, useEffect, useRef } from "react";
const MyContext = createContext();
const MyProvider = ({ children }) => {
  const [dropDown, setDropDown] = useState(true);
  const dropdownRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "system";
  });
  useEffect(() => {
    const prefersDarkScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const selectedTheme =
      theme === "system" ? (prefersDarkScheme ? "dark" : "light") : theme;
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        document.documentElement.setAttribute(
          "data-theme",
          mediaQuery.matches ? "dark" : "light"
        );
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropDown(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropDown = () => {
    setDropDown(!dropDown);
  };

  return (
    <MyContext.Provider
      value={{
        theme,
        setTheme,
        handleThemeChange,
        setDropDown,
        dropDown,
        handleDropDown,
        dropdownRef,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export { MyProvider, MyContext };
