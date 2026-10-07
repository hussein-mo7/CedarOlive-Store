import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart, updateQuantity } from "../redux/cartSlice";
import { createCheckoutSession } from "../api/order/orderApi";
import { clearOrderState } from "../redux/orderSlice";
import { formatPrice, parsePrice } from "../lib/product";
import Button from "../components/ui/Button";
import QuantityStepper from "../features/cart/QuantityStepper";

const FREE_SHIPPING = 50;

export default function Cart() {
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const { loading, error, checkoutSession } = useSelector((state) => state.payment);
  const dispatch = useDispatch();
  const [notice, setNotice] = useState("");
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const amount = parsePrice(totalAmount);
  const remaining = Math.max(0, FREE_SHIPPING - amount);

  useEffect(() => {
    if (checkoutSession?.url) window.location.href = checkoutSession.url;
  }, [checkoutSession]);

  useEffect(() => {
    if (!error) return undefined;
    const timer = setTimeout(() => dispatch(clearOrderState()), 5000);
    return () => clearTimeout(timer);
  }, [error, dispatch]);

  const checkout = async () => {
    if (cartItems.length === 0) {
      setNotice("Your bag is empty.");
      return;
    }
    const products = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: parsePrice(item.price),
      quantity: item.quantity,
      image: item.image || null,
    }));
    try {
      const result = await dispatch(createCheckoutSession({ products })).unwrap();
      if (result?.url) window.location.href = result.url;
      else setNotice("Checkout did not return a payment link.");
    } catch (checkoutError) {
      setNotice(
        typeof checkoutError === "string"
          ? checkoutError
          : checkoutError?.message || "Checkout could not start."
      );
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-wrap py-20">
        <p className="text-xs uppercase tracking-[0.16em] text-text">Bag</p>
        <h1 className="mt-2 text-5xl">Your bag is empty</h1>
        <p className="mt-3 max-w-md text-text">
          When you add a piece, it will be here with the total and checkout.
        </p>
        <Link to="/shop/All" className="mt-8 inline-block">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrap py-10 md:py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-text">Bag</p>
          <h1 className="mt-2 text-5xl">Your bag</h1>
          <p className="mt-2 text-text">
            {count} {count === 1 ? "piece" : "pieces"}
          </p>
        </div>
        <button type="button" className="text-sm text-text underline-offset-2 hover:underline" onClick={() => dispatch(clearCart())}>
          Clear bag
        </button>
      </div>

      {(notice || error) && (
        <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {notice || (typeof error === "string" ? error : "Checkout failed")}
        </p>
      )}

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-borderColor border-y border-borderColor">
          {cartItems.map((item) => (
            <li key={item.id} className="flex gap-4 py-6">
              <Link to={`/product/${item.id}`} className="shrink-0">
                {item.image ? (
                  <img src={item.image} alt="" className="h-32 w-28 rounded-2xl object-cover" />
                ) : (
                  <div className="h-32 w-28 rounded-2xl bg-primary" />
                )}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <Link to={`/product/${item.id}`} className="font-medium leading-snug hover:text-secondary">
                    {item.name}
                  </Link>
                  <p>{formatPrice(parsePrice(item.price) * item.quantity)}</p>
                </div>
                <p className="mt-1 text-sm text-text">{formatPrice(item.price)} each</p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(quantity) => {
                      if (quantity < 1) return;
                      dispatch(updateQuantity({ id: item.id, quantity }));
                    }}
                  />
                  <button
                    type="button"
                    className="text-sm text-text hover:text-title"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="rounded-3xl bg-white p-6 shadow-card lg:sticky lg:top-28">
          <h2 className="text-2xl">Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text">Subtotal</span>
              <span>{formatPrice(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text">Shipping</span>
              <span>{remaining === 0 ? "Free" : "At payment"}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-borderColor pt-4">
            <span>Total</span>
            <span className="text-lg">{formatPrice(amount)}</span>
          </div>
          <p className="mt-3 text-sm text-text">
            {remaining === 0
              ? "Free shipping is included."
              : `Add ${formatPrice(remaining)} more for free shipping. Stripe confirms the final amount.`}
          </p>
          <Button className="mt-6 w-full" onClick={checkout} disabled={loading}>
            {loading ? "Starting checkout…" : "Pay now"}
          </Button>
          <Link to="/shop/All" className="mt-3 block text-center text-sm text-secondary">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
