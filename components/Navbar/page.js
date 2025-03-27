import React from "react";
import NavLink from "../NavLink/page";
import style from "./Navbar.module.css";
import ThemeToggle from "../ThemeToggle/page";
import { MyProvider } from "../ThemeToggle/ThemeContext";
const Navbar = () => {
  return (
    <>
      <div className={style.header}>
        <div className={style.logoContainer}>
          <h2 className={style.logo}>
            recipes <br />
            founder
          </h2>
        </div>
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
