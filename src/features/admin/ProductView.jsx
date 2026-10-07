import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteProductById,
  updateProductById,
  useGetProductById,
} from "../../api/products/productsApi";
import { Input, Textarea } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Skeleton";

export default function ProductView() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data: product, isLoading, error } = useGetProductById(productId);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    images: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      description: product.description || "",
      price: product.price || "",
      images: product.images || [],
    });
  }, [product]);

  const save = async () => {
    if (!form.name.trim() || !form.description.trim() || Number(form.price) <= 0) {
      toast.error("Name, description, and a price above zero are required");
      return;
    }
    setSaving(true);
    const body = new FormData();
    ["name", "brand", "category", "description", "price"].forEach((key) => body.append(key, form[key]));
    newImages.forEach((file) => body.append("images", file));
    form.images.forEach((image) => body.append("existingImages", image));
    const result = await dispatch(updateProductById({ productId, productData: body }));
    setSaving(false);
    if (updateProductById.fulfilled.match(result)) {
      toast.success("Product updated");
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setNewImages([]);
    } else {
      toast.error(result.payload || "Update failed");
    }
  };

  const remove = async () => {
    const result = await dispatch(deleteProductById(productId));
    if (deleteProductById.fulfilled.match(result)) {
      toast.success("Product deleted");
      navigate("/admin/products");
    }
  };

  if (isLoading) return <Spinner label="Loading product" />;
  if (error) return <p className="text-red-700">{error.message}</p>;

  return (
    <div className="max-w-3xl space-y-4">
      <button type="button" className="text-sm text-secondary" onClick={() => navigate("/admin/products")}>
        Back to products
      </button>
      <h1 className="text-4xl">Edit product</h1>
      <div className="flex flex-wrap gap-3">
        {form.images.map((image, index) => (
          <button
            type="button"
            key={image}
            onClick={() => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
          >
            <img src={image} alt="" className="h-24 w-24 rounded-xl object-cover" />
          </button>
        ))}
      </div>
      <label className="block text-sm">
        Add images
        <input
          type="file"
          accept="image/*"
          multiple
          className="mt-2 block"
          onChange={(event) => setNewImages(Array.from(event.target.files || []))}
        />
      </label>
      <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
      <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <Input label="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div className="flex gap-3">
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        <Button variant="danger" onClick={remove}>Delete</Button>
      </div>
    </div>
  );
}
