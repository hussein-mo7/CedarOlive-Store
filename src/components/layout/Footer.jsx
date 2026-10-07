import { Link } from "react-router-dom";
import { pageLinks, shopLinks } from "./navLinks";

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#1c1410] text-[#f6f1eb]">
      <div className="page-wrap grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="font-serif text-3xl">
            Cedar Olive
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#d9cfc6]">
            Home objects chosen for rooms that feel calm, warm, and finished.
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[#b7aca3]">
            Shop
          </p>
          <ul className="space-y-2 text-sm">
            {shopLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-white">
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[#b7aca3]">
            Studio
          </p>
          <ul className="space-y-2 text-sm">
            {pageLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-white">
                  {link.title}
                </Link>
              </li>
            ))}
            <li>
              <a href="mailto:hello@cedarolive.com" className="hover:text-white">
                hello@cedarolive.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="page-wrap flex flex-col gap-2 py-5 text-sm text-[#b7aca3] sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Cedar Olive</p>
          <p>Furniture, lighting, and objects for the home.</p>
        </div>
      </div>
    </footer>
  );
}
