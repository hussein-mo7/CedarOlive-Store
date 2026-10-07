import { Link } from "react-router-dom";
import { useGetAllProducts } from "../../api/products/productsApi";
import ProductCard from "../catalog/ProductCard";
import { ProductSkeleton } from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";

export function ProductRail({ eyebrow, title, query, empty }) {
  const { data, isLoading, error } = useGetAllProducts(query);
  const products = data?.products || [];

  return (
    <section className="page-wrap py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.18em] text-text">{eyebrow}</p>
          )}
          <h2 className="mt-1 text-4xl">{title}</h2>
        </div>
        <Link to="/shop/All" className="hidden sm:block">
          <Button variant="ghost">View all</Button>
        </Link>
      </div>
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-red-700">
          The collection could not be loaded.
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => <ProductSkeleton key={index} />)
          : products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
      </div>
      {!isLoading && products.length === 0 && !error && (
        <p className="mt-6 text-text">{empty || "Nothing here yet."}</p>
      )}
    </section>
  );
}

export function NewArrivals() {
  return (
    <ProductRail
      eyebrow="Spring season"
      title="New arrivals"
      query={{ limit: 4 }}
    />
  );
}

export function FeaturedBrand() {
  return (
    <ProductRail
      eyebrow="From the studio"
      title="Palestinian pieces"
      query={{ brand: "PALESTINIAN", limit: 4 }}
      empty="No pieces from this maker are listed right now."
    />
  );
}
