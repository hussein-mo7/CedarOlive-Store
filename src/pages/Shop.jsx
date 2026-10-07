import { useEffect, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useGetAllProducts } from "../api/products/productsApi";
import ProductCard from "../features/catalog/ProductCard";
import { ProductSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

const PER_PAGE = 12;

export default function Shop() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBrand = searchParams.get("brand") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const query = {
    page: currentPage,
    limit: PER_PAGE,
    ...(category && category !== "All" ? { category } : {}),
    ...(selectedBrand ? { brand: selectedBrand } : {}),
  };

  const { data, isLoading, error } = useGetAllProducts(query);
  const { data: catalog } = useGetAllProducts({ limit: 1000 });
  const products = data?.products || [];
  const totalPages = Math.max(1, Math.ceil((data?.totalResults || 0) / PER_PAGE));

  const { categories, brands } = useMemo(() => {
    const all = catalog?.products || [];
    return {
      categories: ["All", ...new Set(all.map((item) => item.category).filter(Boolean))],
      brands: [...new Set(all.map((item) => item.brand).filter(Boolean))],
    };
  }, [catalog]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category, currentPage, selectedBrand]);

  const setBrand = (brand) => {
    const next = new URLSearchParams(searchParams);
    if (selectedBrand === brand) next.delete("brand");
    else next.set("brand", brand);
    next.set("page", "1");
    setSearchParams(next);
  };

  const setPage = (page) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
  };

  return (
    <div className="page-wrap grid gap-10 py-10 md:grid-cols-[220px_1fr]">
      <aside className="space-y-8 md:sticky md:top-28 md:self-start">
        <div>
          <h2 className="text-xl">Category</h2>
          <ul className="mt-3 space-y-1">
            {categories.map((item) => (
              <li key={item}>
                <Link
                  to={`/shop/${item}${selectedBrand ? `?brand=${encodeURIComponent(selectedBrand)}` : ""}`}
                  className={`block py-1 text-sm ${
                    (category || "All") === item ? "font-medium text-secondary" : "text-text"
                  }`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl">Brand</h2>
          <ul className="mt-3 space-y-1">
            {brands.map((brand) => (
              <li key={brand}>
                <button
                  type="button"
                  onClick={() => setBrand(brand)}
                  className={`py-1 text-sm ${
                    selectedBrand === brand ? "font-medium text-secondary" : "text-text"
                  }`}
                >
                  {brand}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section>
        <p className="text-sm text-text">
          Home / Shop / {category || "All"}
          {selectedBrand ? ` / ${selectedBrand}` : ""}
        </p>
        <h1 className="mt-2 text-4xl">
          {category && category !== "All" ? category : "All products"}
        </h1>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <p className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-red-700">{error.message}</p>
        ) : products.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No pieces match"
              description="Try another category or clear the brand filter."
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              return (
                <Button
                  key={page}
                  size="sm"
                  variant={page === currentPage ? "primary" : "outline"}
                  onClick={() => setPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
