import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { toast } from "sonner";
import { logout } from "../../redux/authSlice";
import { clearCart, removeFromCart, updateQuantity } from "../../redux/cartSlice";
import { resetUserState } from "../../redux/userSlice";
import { useGetAllProducts } from "../../api/products/productsApi";
import { navLinks, pageLinks, shopLinks, NavItem } from "./navLinks";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user.currentUser);
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const { data, isLoading } = useGetAllProducts({
    limit: 100,
    page: 1,
    sort: "-createdAt",
  });

  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const onPointer = (event) => {
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [accountOpen]);

  const closeMenus = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(resetUserState());
    queryClient.removeQueries({ queryKey: ["currentUser"] });
    closeMenus();
    navigate("/signIn");
  };

  const handleCheckout = () => {
    setCartOpen(false);
    if (!user) {
      toast.info("Sign in to continue to checkout");
      navigate("/signIn", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-borderColor bg-background">
      <div className="page-wrap relative flex h-16 items-center xl:h-[4.5rem]">
        <div className="flex min-w-10 items-center">
          <button
            type="button"
            className="rounded-full p-2 hover:bg-primary xl:hidden"
            onClick={() => {
              setAccountOpen(false);
              setMenuOpen((open) => !open);
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="hidden font-serif text-[1.7rem] leading-none tracking-tight xl:block" onClick={closeMenus}>
            Cedar Olive
          </Link>
        </div>

        <Link
          to="/"
          onClick={closeMenus}
          className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl tracking-tight xl:hidden"
        >
          Cedar Olive
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 xl:flex">
          {navLinks.map((link) => (
            <NavItem key={link.path} to={link.path}>
              {link.title}
            </NavItem>
          ))}
        </nav>

        <div className="ml-auto flex items-center">
          <button
            type="button"
            className="rounded-full p-2 hover:bg-primary"
            onClick={() => {
              closeMenus();
              setSearchOpen(true);
            }}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <div className="relative" ref={accountRef}>
            <button
              type="button"
              className="rounded-full p-2 hover:bg-primary"
              onClick={() => {
                setMenuOpen(false);
                setAccountOpen((open) => !open);
              }}
              aria-label="Account"
              aria-expanded={accountOpen}
            >
              <User size={18} />
            </button>
            {accountOpen && (
              <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-borderColor bg-white p-2 shadow-card">
                {user ? (
                  <>
                    <p className="truncate px-3 py-2 text-sm text-text">{user.name}</p>
                    <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-primary" to="/profile" onClick={closeMenus}>
                      Profile
                    </Link>
                    <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-primary" to="/profile/orders" onClick={closeMenus}>
                      Orders
                    </Link>
                    <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-primary" to="/profile/wishlist" onClick={closeMenus}>
                      Wishlist
                    </Link>
                    <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-primary" to="/profile/settings" onClick={closeMenus}>
                      Settings
                    </Link>
                    {user.role === "admin" && (
                      <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-primary" to="/admin" onClick={closeMenus}>
                        Admin
                      </Link>
                    )}
                    <button type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-primary" onClick={handleLogout}>
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-primary" to="/signIn" onClick={closeMenus}>
                      Sign in
                    </Link>
                    <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-primary" to="/signUp" onClick={closeMenus}>
                      Create account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            className="relative rounded-full p-2 hover:bg-primary"
            onClick={() => {
              closeMenus();
              setCartOpen(true);
            }}
            aria-label="Open bag"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-borderColor bg-background xl:hidden">
          <div className="page-wrap grid gap-8 py-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-text">Shop</p>
              <div className="mt-3 flex flex-col">
                {shopLinks.map((link) => (
                  <NavItem key={link.path} to={link.path} onClick={closeMenus} className="py-2 text-base">
                    {link.title}
                  </NavItem>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-text">Studio</p>
              <div className="mt-3 flex flex-col">
                {pageLinks.map((link) => (
                  <NavItem key={link.path} to={link.path} onClick={closeMenus} className="py-2 text-base">
                    {link.title}
                  </NavItem>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={data?.products || []}
        loading={isLoading}
      />
      <CartDrawer
        open={cartOpen}
        items={cartItems}
        total={totalAmount}
        onClose={() => setCartOpen(false)}
        onRemove={(id) => dispatch(removeFromCart(id))}
        onQuantity={(id, quantity) => {
          if (quantity < 1) return;
          dispatch(updateQuantity({ id, quantity }));
        }}
        onClear={() => dispatch(clearCart())}
        onCheckout={handleCheckout}
      />
    </header>
  );
}
