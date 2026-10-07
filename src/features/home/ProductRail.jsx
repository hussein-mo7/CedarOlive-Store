import { useGetAllProducts } from "../../api/products/productsApi";
import ProductCard from "../catalog/ProductCard";
import { ProductSkeleton } from "../../components/ui/Skeleton";

export default function ProductRail({
  eyebrow,
  title,
  query,
  empty = "Nothing in this edit yet.",
}) {
  const { data, isLoading, error } = useGetAllProducts(query);
  const products = data?.products || [];

  return (
    <section className="page-wrap py-12">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.18em] text-text">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-4xl">{title}</h2>
      {error && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-red-700">
          We could not load these pieces. Try again in a moment.
        </p>
      )}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)
          : products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
      </div>
      {!isLoading && !error && products.length === 0 && (
        <p className="mt-6 text-text">{empty}</p>
      )}
    </section>
  );
}
