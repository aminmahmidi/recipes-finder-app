"use client"
import Link from "next/link";
import style from "./NavLinkStyle.module.css";
import { usePathname } from "next/navigation";
const NavLink = ({ children, href }) => {
  const path = usePathname()
  return (
      <Link
        className={[style.navLink, path === href ? style.active : ""].join(" ")}
        href={href}
      >
        {children}
      </Link>
  );
};

export default NavLink;
