import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { createProduct } from "../../api/products/productsApi";
import { Input, Textarea } from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const empty = { name: "", brand: "", price: "", category: "", description: "", images: [] };

export default function AddProductForm() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.product);
  const [form, setForm] = useState(empty);

  const onChange = (event) => {
    const { name, value, type, files } = event.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, images: [...prev.images, ...Array.from(files)] }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? value : value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "images") value.forEach((file) => body.append("images", file));
      else body.append(key, value);
    });
    const result = await dispatch(createProduct(body));
    if (createProduct.fulfilled.match(result)) {
      toast.success("Product added");
      setForm(empty);
    } else {
      toast.error(result.payload || "Could not add the product");
    }
  };

  return (
    <form onSubmit={submit} className="grid max-w-2xl gap-4">
      <h2 className="text-2xl">Add a product</h2>
      <label className="text-sm">
        Images
        <input type="file" accept="image/*" multiple className="mt-2 block" onChange={onChange} />
      </label>
      <div className="flex flex-wrap gap-3">
        {form.images.map((image, index) => (
          <button
            type="button"
            key={`${image.name}-${index}`}
            onClick={() => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
          >
            <img src={URL.createObjectURL(image)} alt="" className="h-24 w-24 rounded-xl object-cover" />
          </button>
        ))}
      </div>
      <Input label="Name" name="name" value={form.name} onChange={onChange} required />
      <Input label="Brand" name="brand" value={form.brand} onChange={onChange} required />
      <Input label="Price" name="price" type="number" step="0.01" value={form.price} onChange={onChange} required />
      <Input label="Category" name="category" value={form.category} onChange={onChange} required />
      <Textarea label="Description" name="description" value={form.description} onChange={onChange} required />
      <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Add product"}</Button>
    </form>
  );
}
