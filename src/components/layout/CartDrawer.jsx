import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { formatPrice, parsePrice } from "../../lib/product";
import Button from "../ui/Button";
import QuantityStepper from "../../features/cart/QuantityStepper";

const FREE_SHIPPING = 50;

export default function CartDrawer({
  open,
  items,
  total,
  onClose,
  onRemove,
  onQuantity,
  onClear,
  onCheckout,
}) {
  const amount = parsePrice(total);
  const remaining = Math.max(0, FREE_SHIPPING - amount);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            type="button"
            className="absolute inset-0 bg-[#1c1410]/45"
            aria-label="Close bag"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#f6f1eb] shadow-card"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28 }}
          >
            <div className="flex items-center justify-between px-5 py-5">
              <div>
                <h2 className="text-3xl">Your bag</h2>
                <p className="text-sm text-text">
                  {count === 0 ? "Nothing here yet" : `${count} ${count === 1 ? "piece" : "pieces"}`}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 hover:bg-primary"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {items.length > 0 && (
              <p className="mx-5 rounded-full bg-white px-4 py-2 text-center text-xs tracking-wide text-text">
                {remaining === 0
                  ? "This order qualifies for free shipping"
                  : `Add ${formatPrice(remaining)} for free shipping`}
              </p>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-start justify-center">
                  <p className="font-serif text-3xl">The bag is empty.</p>
                  <p className="mt-2 max-w-xs text-sm text-text">
                    Pieces you save for later will wait here until checkout.
                  </p>
                  <Link to="/shop/All" onClick={onClose} className="mt-6">
                    <Button>Browse the shop</Button>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <Link to={`/product/${item.id}`} onClick={onClose} className="shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className="h-20 w-[4.5rem] rounded-xl object-cover"
                          />
                        ) : (
                          <div className="h-20 w-[4.5rem] rounded-xl bg-primary" />
                        )}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            to={`/product/${item.id}`}
                            onClick={onClose}
                            className="line-clamp-2 text-sm font-medium leading-snug hover:text-secondary"
                          >
                            {item.name}
                          </Link>
                          <p className="shrink-0 text-sm">
                            {formatPrice(parsePrice(item.price) * item.quantity)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <QuantityStepper
                            value={item.quantity}
                            onChange={(quantity) => onQuantity(item.id, quantity)}
                          />
                          <button
                            type="button"
                            className="text-sm text-text underline-offset-2 hover:text-title hover:underline"
                            onClick={() => onRemove(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-borderColor bg-[#f6f1eb] px-5 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-text">Subtotal</span>
                  <span className="text-lg">{formatPrice(amount)}</span>
                </div>
                <Button className="w-full" onClick={onCheckout}>
                  Checkout
                </Button>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <Link to="/checkout" onClick={onClose} className="text-secondary">
                    Review bag
                  </Link>
                  <button type="button" onClick={onClear} className="text-text">
                    Clear
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
