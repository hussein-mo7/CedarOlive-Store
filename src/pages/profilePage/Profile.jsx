import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { logout } from "../../redux/authSlice";
import { cn } from "../../lib/cn";

const links = [
  { to: "/profile", label: "Details", end: true },
  { to: "/profile/orders", label: "Orders" },
  { to: "/profile/wishlist", label: "Wishlist" },
  { to: "/profile/settings", label: "Settings" },
];

export default function Profile() {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    dispatch(logout());
    new Cookies().remove("token", { path: "/" });
    navigate("/signIn");
  };

  if (!user) return null;

  return (
    <div className="page-wrap grid gap-8 py-12 md:grid-cols-[220px_1fr]">
      <aside>
        <div className="mb-6 flex items-center gap-3">
          <img
            src={user.photo || "/Images/62d9a3c6e6d62f3bc30c1e2e_hero_img-p-1080.jpg"}
            alt=""
            className="h-14 w-14 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-text">{user.email}</p>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm",
                  isActive ? "bg-secondary text-white" : "bg-white text-title"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button type="button" onClick={signOut} className="rounded-full px-4 py-2 text-left text-sm text-red-700">
            Sign out
          </button>
        </nav>
      </aside>
      <section className="rounded-3xl bg-white p-6 shadow-card md:p-8">
        <Outlet context={{ user }} />
      </section>
    </div>
  );
}
