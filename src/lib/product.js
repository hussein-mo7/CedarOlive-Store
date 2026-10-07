export function productId(product) {
  return product?._id || product?.id || "";
}

export function productImage(product) {
  if (!product) return "";
  if (product.image) return product.image;
  const first = product.images?.[0];
  if (!first) return "";
  return typeof first === "string" ? first : first.url || "";
}

export function parsePrice(price) {
  const value = parseFloat(String(price ?? "").replace(/[^0-9.]/g, ""));
  return Number.isNaN(value) ? 0 : value;
}

export function formatPrice(price) {
  if (price == null || price === "") return "";
  if (typeof price === "string" && price.includes("$")) return price;
  const value = typeof price === "number" ? price : parsePrice(price);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function discountPercent(price, oldPrice) {
  const current = parsePrice(price);
  const previous = parsePrice(oldPrice);
  if (!previous || previous <= current) return null;
  return Math.round(((previous - current) / previous) * 100);
}
