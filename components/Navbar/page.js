import React from "react";
import NavLink from "../NavLink/page";
import style from "./Navbar.module.css";
import ThemeToggle from "../ThemeToggle/page";
import { MyProvider } from "../ThemeToggle/ThemeContext";
const Navbar = () => {
  return (
    <>
      <div className={style.navContainer}>
        <div className={style.firstSection}>
          <NavLink href={"/"}>Home</NavLink>
          <NavLink href={"/favorite"}>Favorite</NavLink>
          <NavLink href={"/about"}>About</NavLink>
        </div>
        <div className={style.secondSection}>
          <MyProvider>
            <ThemeToggle />
          </MyProvider>
        </div>
      </div>
    </>
  );
};

export default Navbar;
