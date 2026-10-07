import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { addToCart } from "../../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../api/wishlist/wishlistApi";
import { discountPercent, formatPrice, productId, productImage } from "../../lib/product";

export default function ProductCard({
  product,
  isInWishlist = false,
  onRemoveFromWishlist = null,
  showWishlistRemoveButton = false,
}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const [saved, setSaved] = useState(isInWishlist);
  const [busy, setBusy] = useState(false);
  const id = productId(product);
  const image = productImage(product);
  const discount = discountPercent(product.price, product.oldPrice);
  const rating = parseFloat(product.ratingsAverage) || 0;

  useEffect(() => {
    if (isInWishlist) {
      setSaved(true);
      return;
    }
    const wishlist = user?.wishlist || [];
    setSaved(
      wishlist.some((item) => String(item?._id || item) === String(id))
    );
  }, [isInWishlist, user, id]);

  const toggleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user || busy) return;
    setBusy(true);
    const action = saved || showWishlistRemoveButton ? removeFromWishlist : addToWishlist;
    const result = await dispatch(action(id));
    if (!result.error) {
      setSaved(!saved && !showWishlistRemoveButton);
      if ((saved || showWishlistRemoveButton) && onRemoveFromWishlist) {
        onRemoveFromWishlist(id);
      }
    }
    setBusy(false);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(
      addToCart({
        id,
        name: product.name,
        price: product.price,
        image,
        quantity: 1,
      })
    );
    toast.success(`${product.name} added to bag`);
  };

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-2xl bg-primary">
        <Link to={`/product/${id}`} className="block aspect-[4/5]">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-text">
              No image
            </div>
          )}
        </Link>
        {discount && (
          <span className="absolute left-3 top-3 rounded-full bg-secondary px-2 py-1 text-xs text-white">
            -{discount}%
          </span>
        )}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          {user && (
            <button
              type="button"
              onClick={toggleWishlist}
              disabled={busy}
              className="rounded-full bg-white/90 p-2 text-secondary shadow"
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            >
              <Heart size={16} fill={saved || showWishlistRemoveButton ? "currentColor" : "none"} />
            </button>
          )}
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-full bg-white/90 p-2 shadow"
            aria-label="Add to bag"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-xs uppercase tracking-[0.14em] text-text">{product.brand}</p>
        <Link to={`/product/${id}`} className="mt-1 block font-medium hover:text-secondary">
          {product.name}
        </Link>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span>{formatPrice(product.price)}</span>
          {rating > 0 && (
            <span className="inline-flex items-center gap-1 text-text">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
