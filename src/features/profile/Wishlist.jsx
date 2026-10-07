import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyWishlist } from "../../api/wishlist/wishlistApi";
import ProductCard from "../catalog/ProductCard";
import { Spinner } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";

export default function Wishlist() {
  const { data, isLoading, refetch } = useGetMyWishlist();
  const navigate = useNavigate();
  const items = data?.wishlist || [];

  const handleRemove = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <Spinner label="Loading wishlist" />;

  return (
    <div>
      <h1 className="text-3xl">Wishlist</h1>
      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Nothing saved yet"
            description="Heart a piece in the shop and it will live here."
            action={<Button onClick={() => navigate("/shop/All")}>Browse the shop</Button>}
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {items.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              isInWishlist
              showWishlistRemoveButton
              onRemoveFromWishlist={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
