import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import Button from "../components/ui/Button";

export default function OrderSuccess() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="page-wrap py-20">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-secondary">Payment received</p>
        <h1 className="mt-3 text-4xl">Your order is in.</h1>
        <p className="mt-4 text-text">
          Thank you. A confirmation is on its way to your email.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/profile/orders">
            <Button>View orders</Button>
          </Link>
          <Link to="/shop/All">
            <Button variant="outline">Keep browsing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
