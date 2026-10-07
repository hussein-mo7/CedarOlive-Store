import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { logout } from "../../redux/authSlice";
import { cn } from "../../lib/cn";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/contactMessages", label: "Messages", icon: Mail },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    dispatch(logout());
    navigate("/signIn");
  };

  return (
    <div className="flex min-h-screen bg-background text-title">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-borderColor bg-white p-5 transition md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <p className="font-serif text-2xl">Cedar Olive</p>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-text">Admin</p>
        <nav className="mt-8 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                    isActive ? "bg-secondary text-white" : "hover:bg-primary"
                  )
                }
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-borderColor bg-white px-4 py-3 md:px-8">
          <button type="button" className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <p className="text-sm text-text">{user?.name || "Admin"}</p>
          <button type="button" onClick={signOut} className="inline-flex items-center gap-2 text-sm">
            <LogOut size={16} /> Sign out
          </button>
        </header>
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
