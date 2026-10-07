import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { productId, productImage, formatPrice } from "../../lib/product";

export default function SearchOverlay({ open, onClose, products, loading }) {
  const [term, setTerm] = useState("");

  useEffect(() => {
    if (!open) setTerm("");
  }, [open]);

  if (!open) return null;

  const query = term.trim().toLowerCase();
  const results = !query
    ? products.slice(0, 6)
    : products
        .filter((product) =>
          [product.name, product.description, product.category]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(query))
        )
        .slice(0, 8);

  return (
    <div className="fixed inset-0 z-[70] bg-[#1c1410]/40">
      <div className="mx-auto mt-6 w-[min(720px,calc(100%-2rem))] rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-center gap-3 border-b border-borderColor pb-3">
          <Search size={18} className="text-text" />
          <input
            autoFocus
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search pieces, rooms, materials"
            className="w-full bg-transparent text-lg outline-none"
          />
          <button type="button" onClick={onClose} aria-label="Close search">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <p className="py-8 text-center text-text">Looking through the collection…</p>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-text">Nothing matches that search.</p>
          ) : (
            <ul className="divide-y divide-borderColor">
              {results.map((product) => (
                <li key={productId(product)}>
                  <Link
                    to={`/product/${productId(product)}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-3 hover:bg-primary/60"
                  >
                    <img
                      src={productImage(product)}
                      alt=""
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="text-sm text-text">{product.category}</p>
                    </div>
                    <p className="text-sm">{formatPrice(product.price)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
