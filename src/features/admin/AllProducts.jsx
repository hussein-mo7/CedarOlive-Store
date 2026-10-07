import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGetAllProducts, deleteProductById } from "../../api/products/productsApi";
import { formatPrice, productImage } from "../../lib/product";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";

export default function AllProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetAllProducts({ limit: 200 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState(null);
  const perPage = 8;

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return (data?.products || []).filter((product) =>
      [product.name, product.brand, product.category].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [data, search]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  const remove = async () => {
    if (!target) return;
    const result = await dispatch(deleteProductById(target._id || target.id));
    if (deleteProductById.fulfilled.match(result)) {
      toast.success("Product deleted");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setTarget(null);
    } else {
      toast.error(result.payload || "Could not delete the product");
    }
  };

  return (
    <div>
      <Input
        placeholder="Search products"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
      />
      {isLoading ? (
        <p className="mt-6 text-text">Loading products…</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-borderColor bg-white">
          <table className="w-full text-left text-sm">
            <thead className="text-text">
              <tr>
                <th className="p-3">Piece</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => (
                <tr key={product._id || product.id} className="border-t border-borderColor">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={productImage(product)} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-text">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">{formatPrice(product.price)}</td>
                  <td className="p-3 text-right">
                    <button type="button" className="mr-3 text-secondary" onClick={() => navigate(`/admin/product/${product._id || product.id}`)}>
                      Edit
                    </button>
                    <button type="button" className="text-red-700" onClick={() => setTarget(product)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex gap-2">
        {Array.from({ length: pages }).map((_, index) => (
          <Button key={index} size="sm" variant={page === index + 1 ? "primary" : "outline"} onClick={() => setPage(index + 1)}>
            {index + 1}
          </Button>
        ))}
      </div>
      <Modal open={Boolean(target)} title="Delete this product?" onClose={() => setTarget(null)}>
        <p className="text-sm text-text">{target?.name} will be removed from the shop.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
