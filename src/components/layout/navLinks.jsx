import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";

export const shopLinks = [
  { title: "Shop", path: "/shop/All" },
  { title: "Decor", path: "/shop/Decor" },
  { title: "Wall Art", path: "/shop/Wall Art" },
  { title: "Lighting", path: "/shop/Lighting" },
];

export const pageLinks = [
  { title: "About", path: "/about" },
  { title: "Journal", path: "/blog" },
  { title: "Contact", path: "/contact" },
];

export const navLinks = [...shopLinks, ...pageLinks];

export function NavItem({ to, children, onClick, className }) {
  return (
    <NavLink
      to={to}
      end={to === "/shop/All"}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "whitespace-nowrap text-[13px] tracking-wide text-[#5c534c] transition hover:text-title",
          isActive && "text-title",
          className
        )
      }
    >
      {({ isActive }) => (
        <span className={cn("border-b pb-0.5", isActive ? "border-secondary" : "border-transparent")}>
          {children}
        </span>
      )}
    </NavLink>
  );
}
