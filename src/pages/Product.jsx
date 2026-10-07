import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Minus, Plus, Star, Truck } from "lucide-react";
import { useGetProductById, useGetAllProducts } from "../api/products/productsApi";
import { addToCart } from "../redux/cartSlice";
import { discountPercent, formatPrice, productImage } from "../lib/product";
import Button from "../components/ui/Button";
import { Spinner } from "../components/ui/Skeleton";
import Reviews from "../features/catalog/Reviews";
import ProductCard from "../features/catalog/ProductCard";

export default function Product() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("details");
  const [activeImage, setActiveImage] = useState(0);
  const { data: product, isLoading, error } = useGetProductById(id);
  const { data: related } = useGetAllProducts({
    limit: 4,
    category: product?.category,
    sort: "-createdAt",
  });

  if (isLoading) {
    return (
      <div className="page-wrap py-24">
        <Spinner label="Loading piece" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-wrap py-24 text-center">
        <h1 className="text-4xl">This piece is unavailable</h1>
        <p className="mt-3 text-text">{error?.message || "It may have been removed."}</p>
        <Link to="/shop/All" className="mt-6 inline-block">
          <Button>Back to the shop</Button>
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [productImage(product)];
  const discount = discountPercent(product.price, product.oldPrice);
  const rating = product.ratingsAverage || 0;

  const add = () => {
    dispatch(
      addToCart({
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        image: productImage(product),
        quantity,
      })
    );
    toast.success(`${product.name} added to bag`);
  };

  return (
    <div className="page-wrap py-10">
      <p className="text-sm text-text">
        <Link to="/">Home</Link> / <Link to="/shop/All">Shop</Link> /{" "}
        <Link to={`/shop/${product.category}`}>{product.category}</Link>
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl bg-primary">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`h-20 w-20 overflow-hidden rounded-xl ${
                    index === activeImage ? "ring-2 ring-secondary" : ""
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-secondary">{product.brand}</p>
          <h1 className="mt-2 text-4xl md:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-text">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            {Number(rating).toFixed(1)} · {product.ratingsQuantity || product.reviews?.length || 0} reviews
            <span className={product.availability === false ? "text-red-700" : "text-emerald-700"}>
              {product.availability === false ? "Out of stock" : "In stock"}
            </span>
          </div>
          <div className="mt-5 flex items-end gap-3">
            <p className="text-3xl">{formatPrice(product.price)}</p>
            {product.oldPrice && (
              <p className="text-text line-through">{formatPrice(product.oldPrice)}</p>
            )}
            {discount && <span className="text-sm text-secondary">-{discount}%</span>}
          </div>
          <p className="mt-5 max-w-xl leading-7 text-text">
            {product.shortDescription || product.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-borderColor bg-white">
              <button type="button" className="px-3 py-2" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                <Minus size={16} />
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button type="button" className="px-3 py-2" onClick={() => setQuantity((value) => value + 1)}>
                <Plus size={16} />
              </button>
            </div>
            <Button onClick={add} disabled={product.availability === false}>
              Add to bag
            </Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-text">
            <Truck size={16} /> Free shipping on orders over $50. 30-day returns.
          </p>
        </div>
      </div>

      <div className="mt-14">
        <div className="flex gap-6 border-b border-borderColor">
          {[
            ["details", "Details"],
            ["reviews", "Reviews"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`border-b-2 pb-3 text-sm ${
                tab === key ? "border-secondary text-title" : "border-transparent text-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="py-8">
          {tab === "details" ? (
            <div className="max-w-3xl leading-7 text-text">
              <p>{product.description || "No description yet."}</p>
              {product.details && (
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  {Object.entries(product.details).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-title">{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          ) : (
            <Reviews productId={product.id || product._id} reviews={product.reviews || []} />
          )}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-3xl">More in {product.category}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {(related?.products || [])
            .filter((item) => (item._id || item.id) !== (product._id || product.id))
            .slice(0, 4)
            .map((item) => (
              <ProductCard key={item._id || item.id} product={item} />
            ))}
        </div>
      </section>
    </div>
  );
}
